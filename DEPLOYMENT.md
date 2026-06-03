# デプロイ手順

## Vercelでの公開方法

### 前提条件

- GitHubアカウント
- Vercelアカウント（GitHubでサインアップ可能）

### 手順1: GitHubリポジトリの作成

1. [GitHub](https://github.com)にアクセス
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名: `construction-staff-app`
4. Public（公開）を選択
5. 「Create repository」をクリック

### 手順2: コードをGitHubにプッシュ

ターミナルで以下を実行:

```bash
cd /Users/natsuki.akiyama/construction-staff-app

# すべてのファイルをステージング
git add .

# コミット
git commit -m "Initial commit: 建築会社スタッフアプリ"

# GitHubリポジトリをリモートに追加（YOUR_USERNAMEを自分のユーザー名に置き換え）
git remote add origin https://github.com/YOUR_USERNAME/construction-staff-app.git

# プッシュ
git branch -M main
git push -u origin main
```

### 手順3: Vercelでデプロイ

1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」→「Continue with GitHub」でログイン
3. ダッシュボードで「Add New」→「Project」をクリック
4. GitHubリポジトリ一覧から`construction-staff-app`を選択
5. 「Import」をクリック
6. 設定はデフォルトのままで「Deploy」をクリック

### 完了！

デプロイが完了すると、Vercelが自動的にURLを生成します。

例: `https://construction-staff-app.vercel.app`

このURLを共有すれば、誰でもアクセスできます。

---

## 簡単デプロイ（Vercel CLIを使う方法）

### 1. Vercel CLIをインストール

```bash
npm install -g vercel
```

### 2. デプロイ

```bash
cd /Users/natsuki.akiyama/construction-staff-app
vercel
```

初回は以下の質問に答えます:
- Set up and deploy? → Y
- Which scope? → 自分のアカウントを選択
- Link to existing project? → N
- What's your project's name? → construction-staff-app
- In which directory is your code located? → ./
- Want to override the settings? → N

### 3. 本番デプロイ

```bash
vercel --prod
```

これだけで公開完了です！

---

## カスタムドメインの設定（オプション）

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Domains」
3. 自分のドメインを追加
4. DNSレコードを設定

---

## 環境変数の設定（将来的にデータベースを使う場合）

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Environment Variables」
3. 必要な環境変数を追加

現在はモックデータのみなので、環境変数の設定は不要です。

---

## 更新のデプロイ

コードを変更した後:

```bash
git add .
git commit -m "機能追加: XXX"
git push
```

Vercelが自動的に検出して再デプロイします。

---

## トラブルシューティング

### ビルドエラーが出る場合

1. ローカルでビルドを確認:
   ```bash
   npm run build
   ```

2. エラーが出たら修正してから再デプロイ

### デプロイURLにアクセスできない場合

- 数分待ってから再度アクセス
- Vercelダッシュボードでデプロイステータスを確認

---

## サポート

- [Vercelドキュメント](https://vercel.com/docs)
- [Next.jsデプロイガイド](https://nextjs.org/docs/deployment)
