# 建築会社スタッフアプリ

建築会社向けの従業員コミュニケーション・コンディション管理アプリです。

従業員が日々のコンディションを報告し、感謝を送り合い、親方の予定を確認し、事務連絡を共有できる場を提供します。

---

## 🎯 主な機能

### 従業員向け
- **コンディションチェック**: 5問のアンケート形式で日々の状態を記録 + 実務的な相談を書き込み
- **感謝文化**: クイック感謝（2タップで送信）、今日の感謝チャレンジ、週間ランキング
- **チーム状況**: チームの雰囲気、最近の感謝タイムライン
- **カレンダー**: 親方の予定を月間カレンダーで確認
- **掲示板**: 事務連絡をチーム全員で共有
- **ポートフォリオ**: 受け取った評価・感謝を確認

### マネージャー向け
- **ダッシュボード**: チーム全体のコンディション推移をグラフで可視化
- **アラート**: 要注意従業員の自動検出、コンディション低下の警告
- **推奨アクション**: 優先度付きのAIアドバイス
- **統計分析**: 質問別スコア、感謝ランキング、MVP表示
- **詳細レポート**: 各従業員のコンディション詳細 + AIアドバイス

---

## 🚀 クイックスタート

### オンラインで確認（デプロイ済み）

**デモURL**: https://construction-staff-app.vercel.app *(デプロイ後に更新)*

- 従業員画面: `/demo/employee`
- マネージャー画面: `/demo/manager`
- 統合ダッシュボード: `/demo/dashboard`（タブ切り替え）

### ローカルで起動

```bash
# 1. リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/construction-staff-app.git
cd construction-staff-app

# 2. 依存関係をインストール
npm install

# 3. 開発サーバー起動
npm run dev
```

`http://localhost:3000` でアクセスできます。

---

## 📦 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 16+ | フレームワーク (App Router) |
| TypeScript | 5+ | 型安全 |
| Tailwind CSS | v4 | スタイリング |
| Lucide React | 最新 | アイコン |

---

## 🌐 デプロイ

### Vercelで公開

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/construction-staff-app)

詳細な手順は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

### 簡単デプロイ（Vercel CLI）

```bash
npm install -g vercel
vercel
```

---

## 📖 ドキュメント

- [QUICK_START.md](./QUICK_START.md) - すぐに始めるガイド
- [FEATURES.md](./FEATURES.md) - 機能詳細・感謝文化の設計思想
- [DEPLOYMENT.md](./DEPLOYMENT.md) - デプロイ手順
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - プロジェクト構成

---

## 🎨 スクリーンショット

### 従業員ダッシュボード
- 今日の感謝チャレンジ
- クイック感謝（2タップ送信）
- チームの雰囲気
- コンディションチェック

### マネージャーダッシュボード
- 週間コンディション推移グラフ
- 注意事項・アラート
- 推奨アクション
- 質問別スコア分析

---

## 🛠️ カスタマイズ

詳細は各ドキュメントを参照してください。

- 従業員名の変更
- アンケート内容のカスタマイズ
- カレンダーの予定設定
- 掲示板の内容変更

---

## 📄 ライセンス

MIT

---

## 🙏 貢献

プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

---

## 📞 サポート

質問や問題がある場合は、[Issues](https://github.com/YOUR_USERNAME/construction-staff-app/issues)を作成してください。
