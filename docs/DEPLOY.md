# デプロイ / テスト環境

## ブランチとデプロイ先

| ブランチ | Backend (Render) | Frontend (Vercel) | DB (Turso) |
|---|---|---|---|
| `main` | `keiba-tracker-backend` (本番) | Production deployment | `keiba-tracker` |
| `develop` | `keiba-tracker-backend-staging` | Preview deployment | `keiba-tracker-staging` |

`feature/*` などの作業ブランチは、`develop` にマージしてからテスト環境で確認する運用を想定。

## 1. Render — backendステージング

`render.yaml` に `keiba-tracker-backend-staging`（`branch: develop`）を追加済み（現在ワーキングツリーに未コミット）。

初回のみRenderダッシュボードでの作業が必要：

1. Render dashboard → 新規Blueprintを再sync（`render.yaml` の変更を反映）
2. `keiba-tracker-backend-staging` サービスの Environment タブで以下を設定
   - `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` → 下記のステージング用Tursoの値
   - `JWT_SECRET` → 本番とは別の値を発行（`openssl rand -base64 32` などで生成）
   - `APP_USERNAME` / `APP_PASSWORD` → ステージング用の値でOK
   - `CORS_ALLOWED_ORIGINS` → 現状コード側で参照されていないため未設定でも動作（下記「既知の注意点」参照）

## 2. Turso — ステージングDB作成

本番のスキーマをそのまま複製できる branching を使うと楽（未ログインのため実行は手元で）：

```bash
turso auth login

# 本番DBのスキーマ・データをコピーしてステージングDBを作成
turso db create keiba-tracker-staging --from-db keiba-tracker

# 接続情報を取得（Renderの env に設定する）
turso db show keiba-tracker-staging --url
turso db tokens create keiba-tracker-staging
```

データを分離したいだけでスキーマだけ欲しい場合は `--from-db` を外して素の `turso db create keiba-tracker-staging` でも可。

## 3. Vercel — frontendプレビュー環境

Vercelのgit連携が有効なら、`develop` へのpushは追加設定なしで自動的にPreviewデプロイになります（Production Branchが `main` になっていることだけ確認）。

Preview環境用の環境変数を分けたい場合（backendのURLがステージング用になるよう）:

1. Vercel dashboard → Project → Settings → Environment Variables
2. `VITE_API_URL` を追加し、Environmentで **Preview** のみを選択
   - 値: `https://keiba-tracker-backend-staging.onrender.com`（Renderのステージングサービスのデプロイ後に確定するURL）
3. 本番用の `VITE_API_URL`（Production環境向け）はそのまま `https://keiba-tracker-backend.onrender.com` を設定

CLIでやる場合:

```bash
npm i -g vercel
vercel login
vercel link            # frontend/ 配下で実行しプロジェクトに紐付け
vercel env add VITE_API_URL preview
```

## 使い方

```bash
git checkout develop
git merge feature/login   # or 作業ブランチをdevelopにマージ
git push origin develop
```

→ Render staging serviceとVercel Preview deploymentが自動で走り、テスト環境で確認できる。
問題なければ `develop` → `main` にマージして本番反映。

## 既知の注意点

- `SecurityConfig.java` の CORS 設定が `addAllowedOriginPattern("*")` 固定になっており、`application.properties` の `cors.allowed-origins`（`CORS_ALLOWED_ORIGINS` env var）は現状コードから参照されていません。今は全オリジン許可なのでテスト環境のURLが変わっても動きますが、将来オリジンを絞る場合は `SecurityConfig` 側の修正が必要です。
