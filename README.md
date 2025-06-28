# 読書管理アプリ

読んだ本を記録・管理するためのWebアプリケーションです。[Next.js](https://nextjs.org/)を使用して構築されています。

## 機能

- **本の一覧表示**: 読了した本をグリッド形式で表示
- **年別フィルタリング**: 読了年（2015年〜2024年）で本を絞り込み
- **無限スクロール**: 48冊ずつ段階的に本を読み込み
- **詳細ページ**: 各本の詳細情報（著者、出版社、ISBN、読了日など）を表示
- **レスポンシブデザイン**: PC・スマートフォン両対応

## 技術スタック

- **フレームワーク**: Next.js 15.2.4
- **言語**: TypeScript 4.9.4
- **スタイリング**: CSS Modules
- **リンター**: ESLint + Prettier
- **画像最適化**: Next.js Image コンポーネント

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd book-read-history

# 依存関係をインストール
npm install
```

### 開発環境の起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## 利用可能なコマンド

```bash
# 開発サーバーを起動
npm run dev

# 本番用ビルドを作成
npm run build

# 本番サーバーを起動
npm start

# ESLintでコードをチェック
npm run lint

# ESLint + Prettierでコードを整形
npm run format

# CSVから本データを自動変換・更新
npm run convert
# または
npm run books:update
```

## データ管理

### 本のデータ追加

1. `/public/books.csv` に新しい本の情報を追加
2. 自動変換スクリプトを実行: `npm run convert`
3. 新しい年度が追加された場合は、`/pages/index.tsx` の年フィルターボタンを更新

**自動化により、手動でのコピー作業は不要になりました！**

### データ形式

各本のデータには以下の情報が含まれます：

```typescript
{
  id: string; // SHA-256ハッシュ（タイトル+著者から生成）
  title: string; // 書籍タイトル
  author: string; // 著者名
  publisher: string; // 出版社
  isbn: string; // ISBN
  readDate: string; // 読了日（YYYY/MM/DD形式）
  thumnailImage: string; // サムネイル画像URL
}
```

## プロジェクト構造

```
├── pages/
│   ├── index.tsx          # メインページ（本の一覧）
│   ├── items/[id].tsx     # 本の詳細ページ
│   └── _app.tsx           # Next.jsアプリのルート
├── public/
│   ├── books.csv          # 本のデータ（CSV形式）
│   ├── books.ts           # 本のデータ（TypeScript）
│   └── favicon.ico
├── styles/
│   ├── Home.module.css    # メインページのスタイル
│   ├── Detail.module.css  # 詳細ページのスタイル
│   └── globals.css        # グローバルスタイル
├── convert.js             # CSV→JSON変換スクリプト
├── next.config.js         # Next.js設定
└── tsconfig.json          # TypeScript設定
```

## デプロイ

### Vercelでのデプロイ

最も簡単なデプロイ方法は [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) を使用することです。

詳細は [Next.js deployment documentation](https://nextjs.org/docs/deployment) をご確認ください。

## 開発ガイドライン

- コミット前には必ず `npm run lint` を実行してコード品質を確認
- 新機能追加時は既存のコードスタイルに従う
- 画像最適化のため、Next.js Imageコンポーネントを使用
- CSS ModulesまたはグローバルCSSでスタイリング

## ライセンス

© 2024 読書管理. All rights reserved.
