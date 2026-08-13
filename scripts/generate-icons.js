// PWAアイコン生成スクリプト（外部パッケージ不要）
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// アイコンを描画する関数
// オレンジ背景 (#FF7A35) + 白文字 "S"
function drawIcon(size) {
  const pixels = Buffer.alloc(size * size * 4); // RGBA

  const bgR = 0xFF, bgG = 0x7A, bgB = 0x35;
  const fgR = 0xFF, fgG = 0xFF, fgB = 0xFF;
  const cornerR = size * 0.22; // 角丸の半径

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // 角丸の判定
      const dx = Math.min(x, size - 1 - x);
      const dy = Math.min(y, size - 1 - y);
      const inCorner = dx < cornerR && dy < cornerR;
      const dist = Math.sqrt((cornerR - dx) ** 2 + (cornerR - dy) ** 2);
      const inside = !inCorner || dist <= cornerR;

      if (inside) {
        pixels[idx] = bgR;
        pixels[idx + 1] = bgG;
        pixels[idx + 2] = bgB;
        pixels[idx + 3] = 255;
      } else {
        pixels[idx] = pixels[idx + 1] = pixels[idx + 2] = pixels[idx + 3] = 0;
      }
    }
  }

  // "S" を描画（簡易ピクセルフォント）
  const letterSize = Math.floor(size * 0.55);
  const letterX = Math.floor((size - letterSize) / 2);
  const letterY = Math.floor((size - letterSize) / 2);
  const thick = Math.max(2, Math.floor(letterSize * 0.14));
  const hw = Math.floor(letterSize / 2);
  const hw2 = letterSize - hw;

  // Sの形を描く（上バー・中バー・下バー + 左上・右下の縦線）
  const rects = [
    // 上横棒
    [letterX, letterY, letterSize, thick],
    // 中横棒
    [letterX, letterY + hw - Math.floor(thick / 2), letterSize, thick],
    // 下横棒
    [letterX, letterY + letterSize - thick, letterSize, thick],
    // 左上縦棒
    [letterX, letterY, thick, hw],
    // 右下縦棒
    [letterX + letterSize - thick, letterY + hw, thick, hw2],
  ];

  for (const [rx, ry, rw, rh] of rects) {
    for (let py = ry; py < ry + rh && py < size; py++) {
      for (let px = rx; px < rx + rw && px < size; px++) {
        if (px < 0 || py < 0) continue;
        const idx = (py * size + px) * 4;
        if (pixels[idx + 3] === 255) {
          pixels[idx] = fgR;
          pixels[idx + 1] = fgG;
          pixels[idx + 2] = fgB;
        }
      }
    }
  }

  return pixels;
}

function createPNG(size) {
  const pixels = drawIcon(size);

  // RGBAをRGBに変換（フィルタバイト付き）
  const rawData = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    rawData[y * (1 + size * 4)] = 0; // フィルタ: None
    for (let x = 0; x < size; x++) {
      const srcIdx = (y * size + x) * 4;
      const dstIdx = y * (1 + size * 4) + 1 + x * 4;
      rawData[dstIdx] = pixels[srcIdx];
      rawData[dstIdx + 1] = pixels[srcIdx + 1];
      rawData[dstIdx + 2] = pixels[srcIdx + 2];
      rawData[dstIdx + 3] = pixels[srcIdx + 3];
    }
  }

  const compressed = zlib.deflateSync(rawData);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type: RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG署名
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

const publicDir = path.join(__dirname, '..', 'public');

for (const size of [192, 512]) {
  const png = createPNG(size);
  const outPath = path.join(publicDir, `icon-${size}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`✓ ${outPath} (${size}x${size})`);
}

// apple-touch-icon (180x180)
const applePng = createPNG(180);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), applePng);
console.log(`✓ apple-touch-icon.png (180x180)`);
