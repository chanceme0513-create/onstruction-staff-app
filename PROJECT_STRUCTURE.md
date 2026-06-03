# 建築会社スタッフアプリ - プロジェクト構成

## 概要

このアプリは、建築会社の従業員が日々のコンディションを報告し、親方の予定を確認し、事務連絡を共有するためのWebアプリケーションです。

## 主な機能

### 1. コンディションチェック（5問アンケート形式）
- 体調チェック
- 作業進捗の確認
- チーム内コミュニケーション
- 安全面の確認
- モチベーション確認
- 実務的な相談の書き込み欄

### 2. 親方の予定カレンダー
- 親方の今後の予定を一覧表示
- 時間、場所、内容を確認可能

### 3. 掲示板（事務連絡）
- 重要なお知らせをピン留め表示
- チーム全体への連絡事項を共有

### 4. コンディション履歴
- 過去のコンディションチェック結果を確認

## ディレクトリ構成

```
construction-staff-app/
├── src/
│   ├── app/
│   │   ├── demo/
│   │   │   └── employee/         # 従業員ダッシュボード画面
│   │   ├── page.tsx               # トップページ
│   │   └── layout.tsx             # ルートレイアウト
│   └── components/
│       ├── employee/
│       │   ├── ConditionSurvey.tsx   # 5問アンケート
│       │   ├── BossSchedule.tsx      # 親方の予定
│       │   └── Noticeboard.tsx       # 掲示板
│       ├── layout/
│       │   ├── AppHeader.tsx
│       │   └── EmployeeLayout.tsx
│       └── ui/                     # 共通UIコンポーネント
├── package.json
├── README.md
└── PROJECT_STRUCTURE.md (このファイル)
```

## 技術スタック

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide React** (アイコン)

## セットアップ手順

1. 依存関係のインストール:
   ```bash
   npm install
   ```

2. 開発サーバーの起動:
   ```bash
   npm run dev
   ```

3. ブラウザで `http://localhost:3000` を開く

## 画面遷移

- `/` - トップページ（建築会社スタッフアプリの紹介）
- `/demo/employee` - 従業員ダッシュボード（メイン画面）

## データについて

現在、すべてのデータはダミーデータ（モック）で動作しています。実際のデータベース接続は実装されていません。

## カスタマイズ方法

### 従業員名の変更
`src/app/demo/employee/page.tsx` の以下の部分を編集:
```tsx
<p className="text-xl font-bold">田中 太郎 さん</p>
```

### アンケート項目の変更
`src/components/employee/ConditionSurvey.tsx` の `QUESTIONS` 配列を編集

### 親方の予定データの変更
`src/components/employee/BossSchedule.tsx` の `DUMMY_SCHEDULES` 配列を編集

### 掲示板の投稿内容の変更
`src/components/employee/Noticeboard.tsx` の `DUMMY_NOTICES` 配列を編集

## 今後の拡張案

- データベースとの連携（Supabase等）
- 管理者画面の追加
- 通知機能
- カレンダー機能の強化（Googleカレンダー連携等）
- チャット機能
