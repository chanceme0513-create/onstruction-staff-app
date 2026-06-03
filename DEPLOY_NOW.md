# 今すぐデプロイ - 3ステップガイド 🚀

このアプリを公開して、誰でもアクセスできるようにする手順です。

---

## 方法1: GitHub + Vercel（推奨）⭐

### ステップ1: GitHubにアップロード

1. **GitHubにアクセス**: https://github.com
2. **新規リポジトリ作成**:
   - 右上の「+」→「New repository」
   - リポジトリ名: `construction-staff-app`
   - **Public**（公開）を選択
   - 「Create repository」をクリック

3. **ターミナルで実行**:

```bash
# GitHubのユーザー名を確認（YOUR_USERNAMEの部分）
# 例: https://github.com/taro-yamada の場合、YOUR_USERNAME = taro-yamada

cd /Users/natsuki.akiyama/construction-staff-app

# リモートリポジトリを追加（YOUR_USERNAMEを自分のに置き換え）
git remote add origin https://github.com/YOUR_USERNAME/construction-staff-app.git

# プッシュ
git push -u origin main
```

ユーザー名とパスワードを求められたら:
- ユーザー名: GitHubのユーザー名
- パスワード: Personal Access Token（後述）

**Personal Access Tokenの作成方法**:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」→「Generate new token (classic)」
3. Note: `deployment`、Expiration: `No expiration`
4. スコープ: `repo` にチェック
5. 「Generate token」→トークンをコピー（これがパスワード）

### ステップ2: Vercelでデプロイ

1. **Vercelにアクセス**: https://vercel.com
2. **サインアップ**: 「Sign Up」→「Continue with GitHub」
3. **GitHubと連携**: アクセス許可を承認
4. **プロジェクトをインポート**:
   - ダッシュボードで「Add New」→「Project」
   - `construction-staff-app`を探して「Import」
   - 設定はそのままで「Deploy」をクリック

### ステップ3: 完了！

デプロイが完了すると（1〜2分）、URLが表示されます。

例: `https://construction-staff-app-xxx.vercel.app`

このURLを共有すれば、誰でもアクセスできます！

---

## 方法2: Vercel CLI（コマンド1つ）⚡

ターミナルで実行:

```bash
# 1. Vercel CLIをインストール
npm install -g vercel

# 2. プロジェクトフォルダに移動
cd /Users/natsuki.akiyama/construction-staff-app

# 3. デプロイ
vercel

# 初回は質問に答える:
# - Set up and deploy? → Y
# - Which scope? → あなたのアカウントを選択
# - Link to existing project? → N
# - What's your project's name? → construction-staff-app
# - In which directory is your code located? → ./（そのままEnter）
# - Want to override the settings? → N

# 4. 本番環境にデプロイ
vercel --prod
```

完了！URLが表示されます。

---

## デプロイ後の確認

### 動作チェック

1. **トップページ**: `https://あなたのURL.vercel.app`
2. **統合ダッシュボード**: `https://あなたのURL.vercel.app/demo/dashboard`
3. **従業員画面**: `https://あなたのURL.vercel.app/demo/employee`
4. **マネージャー画面**: `https://あなたのURL.vercel.app/demo/manager`

### URLをわかりやすくする（オプション）

Vercelダッシュボードで:
1. プロジェクトを開く
2. 「Settings」→「Domains」
3. 「Edit」でカスタム名を設定
   - 例: `construction-staff-app.vercel.app` → `my-team-app.vercel.app`

---

## 更新する場合

コードを変更した後:

```bash
cd /Users/natsuki.akiyama/construction-staff-app
git add .
git commit -m "機能追加: XXX"
git push
```

Vercelが自動的に再デプロイします（1〜2分）。

---

## トラブルシューティング

### ビルドエラーが出る

ローカルでビルドを確認:
```bash
npm run build
```

エラーが出たら修正してから再度プッシュ。

### GitHubにプッシュできない

- Personal Access Tokenを確認
- リモートURLが正しいか確認: `git remote -v`

### Vercelでデプロイできない

- GitHubリポジトリがPublicになっているか確認
- Vercelのログを確認（ダッシュボード → Deployments → エラーをクリック）

---

## サポート

- [Vercelドキュメント](https://vercel.com/docs)
- [GitHubヘルプ](https://docs.github.com)

---

🎉 **おめでとうございます！**

あなたのアプリが世界中からアクセスできるようになりました。

URLを共有して、チームメンバーに試してもらいましょう！
