# 読書管理アプリ

読んだ本を記録・管理する Next.js 製の Web アプリケーションです。モバイル/デスクトップ双方で快適に利用でき、フィルタリングやスクロールの状態まで途切れなく引き継ぐ読書ログ体験を提供します。

## 主な機能
- **本棚ビュー**: グリッド表示で書影とメタ情報を一覧し、Intersection Observer による無限スクロールで 48 冊ずつ丁寧に追加ロード。
- **年別フィルタ & セッション復元**: 選択した読了年は sessionStorage に保存され、年の追加/削除にも自動追従して次回来訪時も同じ条件で閲覧可能。
- **詳細ページ & Kindle ハイライト連携**: 著者・出版社・ISBN・ASIN などをまとめ、Kindle の `kindle://` deeplink 付きハイライトを閲覧/遷移できます。
- **アクセシビリティ**: ボタン/カードには ARIA 属性とキーボード操作を実装し、スクリーンリーダーでも読了冊数や操作対象が分かりやすい設計。
- **スクロール位置の復元**: 独自イベントと sessionStorage を組み合わせ、一覧↔詳細遷移後も最後に見ていたカード位置まで自動で戻す挙動を実装。

## 技術スタック
- **フレームワーク**: Next.js 15.x（Pages Router）
- **言語**: TypeScript 5.9（strict モード）
- **UI**: Tailwind CSS（atomic design 構成のコンポーネント群）
- **アイコン**: Font Awesome（`src/fontawesome.ts` で全 Solid アイコンを登録）
- **リンター/フォーマッター**: Biome（`lint` / `lint:fix` / `format`）
- **データ変換**: Node.js スクリプト `convert.js`（CSV→型安全な TS + JSON 出力）

## セットアップ

### 前提条件
- Node.js 18 以上
- npm

### インストールと開発開始
```bash
git clone <repository-url>
cd book-read-history
npm install
npm run dev
```
http://localhost:3000 でアプリを確認できます。停止は `Ctrl + C`。

## 利用可能なコマンド
```bash
npm run dev          # 開発サーバー起動（127.0.0.1:3000）
npm run build        # 本番ビルドを生成（CI 相当）
npm start            # 生成済みビルドをローカルで起動
npm run lint         # Biome での静的解析
npm run lint:fix     # Lint 違反の自動修正（biome check --write）
npm run format       # Biome のフォーマッタのみ実行
npm run test         # Vitest によるユニットテストを実行
npm run test:e2e     # Playwright で E2E テスト（自動で dev サーバー起動）
npm run convert      # CSV から books.ts / export.json を再生成
npm run books:update # convert のエイリアス（慣用コマンド）
```

## テスト
- ユニットテスト: `npm run test`。`tests/utils` や対象コンポーネント付近に配置した Vitest スイートを実行します。
- E2E テスト: `npm run test:e2e`。Playwright が Chromium/Firefox/WebKit の 3 ブラウザでホーム→詳細の導線を検証し、失敗時にスクリーンショット・トレースを保存します。既存サーバーを使う場合は `PLAYWRIGHT_BASE_URL` を指定してください。

## データ更新フロー
1. `public/books.csv` に新しい本の情報を追記します（列構成は既存行を参照）。
2. ハイライトがあれば `public/highlights.csv` も追記します。
3. `npm run convert` または `npm run books:update` を実行すると、以下が自動更新されます。
   - `public/books.ts`: アプリで参照する型付きデータ
   - `export.json`: 外部エクスポートやバックアップに利用する JSON
4. 変換後は開発サーバーを再起動して最新データを読み込みます。
5. 読了年が増えた場合でも `useBookFilter` が自動で年リストを算出するため、手動メンテナンスは不要です。

## プロジェクト構造
```
├── src/
│   ├── pages/           # Next.js のページ（一覧・詳細）
│   ├── components/      # Atomic Design 準拠の UI レイヤー
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── hooks/           # 年フィルタや無限スクロール/スクロール復元ロジック
│   ├── utils/           # データ整形・SessionStorage ラッパ
│   ├── constants/       # アプリ共通定数
│   ├── data/            # `public/books.ts` を re-export
│   └── styles/          # Tailwind を中心としたグローバルスタイル
├── public/              # CSV ソース・静的アセット
├── convert.js           # CSV→TS 変換スクリプト
├── export.json          # books.csv の JSON 変換結果
└── package.json
```

## 実装メモ
- 年選択・表示冊数・スクロール位置は `sessionStorage` に保持し、`storage` ユーティリティで安全に読み書きしています。
- 無限スクロールは Intersection Observer + 遅延ロードで負荷を抑え、`books-rendered` イベントでスクロール復元と連携しています。
- 詳細画面の Kindle リンクは ASIN が生成できる ISBN のみ deeplink を表示し、未対応の本でも一覧からの遷移は阻害しません。
- Font Awesome の Solid アイコンをグローバル登録し、アイコン読み込みを 1 か所に集約しています。

## コントリビューション
[AGENTS.md](./AGENTS.md) にコーディング規約・レビュー手順などの詳細があります。Pull Request 作成前に `npm run lint` と `npm run build` を通過させてください。UI 変更がある場合はスクリーンショットの添付も推奨です。

## デプロイ
[Vercel](https://vercel.com/) へのデプロイを推奨しています。GitHub リポジトリを接続すると自動ビルドとプレビューが利用できます。詳細は [Next.js Deployment ドキュメント](https://nextjs.org/docs/deployment) を参照してください。

## ライセンス
© 2024 読書管理. All rights reserved.
