# GitHub Actions ワークフロー

このディレクトリには、読書管理アプリの CI/CD パイプラインを定義するワークフローが含まれています。

## ワークフロー一覧

### 1. Quality (`quality.yml`)

**トリガー**: `main` へのプッシュ / すべてのプルリクエスト

`npm run lint`（Biome）、`npm run format`（フォーマット差分チェック）、
`npm run typecheck`（`tsc --noEmit`）、`npm run build` を順に実行します。
最後に `npm run convert` を実行し、`public/books.ts` と `export.json` が
CSV から再生成した内容と一致するか（＝データ再生成の忘れがないか）を検証します。

### 2. Unit Tests (`unit-tests.yml`)

**トリガー**: `main` へのプッシュ / すべてのプルリクエスト

Vitest をカバレッジ付きで実行し、結果を PR にコメントします。
カバレッジ閾値は `vitest.config.ts` で定義しています（対象は `src/utils/**`）。

### 3. E2E Tests (`e2e-tests.yml`)

**トリガー**: `main` へのプッシュ / すべてのプルリクエスト

Playwright で Chromium / Firefox / WebKit の 3 ブラウザを起動し、
`tests/e2e` のシナリオを実行します。サーバーは `playwright.config.ts` の
`webServer` 設定が自動で起動します（CI では本番ビルドを使用）。

### 4. CodeQL (`codeql.yml`)

**トリガー**: `main` / `develop` へのプッシュ、`main` 向けプルリクエスト、毎週日曜の定期実行

`security-extended` と `security-and-quality` のクエリセットで静的解析を行います。

### 5. Deploy to GitHub Pages (`nextjs.yml`)

**トリガー**: `main` へのプッシュ、または手動実行（`workflow_dispatch`）

Next.js をビルドして `out/` を GitHub Pages へデプロイします。

### 6. Dependabot (`../dependabot.yml`)

npm パッケージと GitHub Actions の依存を毎週更新します。

## ローカルでの事前確認

PR を出す前に、Quality ワークフローと同じチェックをローカルで実行できます。

```bash
npm run lint
npm run format     # 差分があれば失敗。npm run lint:fix で自動修正
npm run typecheck
npm run build
npm run test
```

## トラブルシューティング

- **E2E テストの失敗**: 失敗時のみスクリーンショット・トレース・動画が保存されます（`playwright.config.ts`）。
- **Quality の「データ再生成」ステップの失敗**: `public/*.csv` を更新した際に `npm run convert` を実行し忘れています。ローカルで実行して差分をコミットしてください。
- **ビルドエラー**: まず `npm run typecheck` で型エラーを切り分けてください。
