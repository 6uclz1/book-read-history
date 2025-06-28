# 読書管理アプリ

読んだ本を記録・管理するためのWebアプリケーションです。[Next.js](https://nextjs.org/)を使用して構築されています。

## 機能

- **本の一覧表示**: 読了した本をグリッド形式で表示
- **年別フィルタリング**: 読了年（2015年〜2024年）で本を絞り込み
- **無限スクロール**: 48冊ずつ段階的に本を読み込み
- **詳細ページ**: 各本の詳細情報（著者、出版社、ISBN、読了日など）を表示
- **レスポンシブデザイン**: PC・スマートフォン両対応

## 技術スタック

- **フレームワーク**: Next.js 15.3.4
- **言語**: TypeScript 5.8.3
- **スタイリング**: CSS Modules
- **リンター**: ESLint + Prettier
- **テスト**: Jest + React Testing Library + Playwright
- **CI/CD**: GitHub Actions
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

### 開発コマンド

```bash
# 開発サーバーを起動
npm run dev

# 本番用ビルドを作成
npm run build

# 本番サーバーを起動
npm start
```

### コード品質・テスト

```bash
# ESLintでコードをチェック
npm run lint

# Prettierでコードを自動整形（コミット前必須）
npm run format

# 単体テスト（Jest + React Testing Library）
npm run test

# テスト（ウォッチモード）
npm run test:watch

# カバレッジ付きテスト
npm run test:coverage

# E2Eテスト（Playwright）
npm run test:e2e

# E2Eテスト（UIモード）
npm run test:e2e:ui

# Playwrightブラウザをインストール
npm run playwright:install

# 総合品質チェック（lint + format + test + tsc）
npm run quality:check
```

### データ管理

```bash
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
├── .github/workflows/     # GitHub Actions CI/CD設定
│   ├── ci.yml            # CI パイプライン
│   ├── nextjs.yml        # デプロイメント
│   └── security.yml      # セキュリティ監査
├── __tests__/            # テストファイル
│   ├── components/       # コンポーネントのテスト
│   ├── hooks/            # カスタムフックのテスト
│   └── pages/            # ページのテスト
├── e2e/                  # E2Eテスト（Playwright）
├── components/           # Reactコンポーネント
│   ├── BookCard.tsx      # 本のカードコンポーネント
│   ├── BookGrid.tsx      # 本のグリッドコンポーネント
│   └── YearFilter.tsx    # 年別フィルターコンポーネント
├── hooks/                # カスタムフック
│   ├── useBookFilter.ts  # 本のフィルタリング
│   └── useInfiniteScroll.ts # 無限スクロール
├── pages/
│   ├── index.tsx         # メインページ（本の一覧）
│   ├── items/[id].tsx    # 本の詳細ページ
│   └── _app.tsx          # Next.jsアプリのルート
├── public/
│   ├── books.csv         # 本のデータ（CSV形式）
│   ├── books.ts          # 本のデータ（TypeScript）
│   └── favicon.ico
├── styles/
│   ├── Home.module.css   # メインページのスタイル
│   ├── Detail.module.css # 詳細ページのスタイル
│   └── globals.css       # グローバルスタイル
├── types/                # TypeScript型定義
├── convert.js            # CSV→JSON変換スクリプト
├── jest.config.js        # Jest設定
├── playwright.config.ts  # Playwright設定
├── next.config.js        # Next.js設定
└── tsconfig.json         # TypeScript設定
```

## デプロイ

### Vercelでのデプロイ

最も簡単なデプロイ方法は [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) を使用することです。

詳細は [Next.js deployment documentation](https://nextjs.org/docs/deployment) をご確認ください。

## テスト

このプロジェクトは包括的なテスト戦略を採用しています：

### 単体テスト（Jest + React Testing Library）

- **コンポーネントテスト**: BookCard, BookGrid, YearFilter
- **カスタムフックテスト**: useBookFilter, useInfiniteScroll
- **ページテスト**: index.tsx
- **カバレッジ**: 78% statements, 78% branches

### E2Eテスト（Playwright）

- **ブラウザ横断テスト**: Chrome, Firefox, Safari
- **ユーザーシナリオ**: フィルタリング、無限スクロール、ナビゲーション
- **アクセシビリティ**: キーボードナビゲーション、ARIA属性

### CI/CD

GitHub Actionsで自動化：
- コード品質チェック（ESLint, Prettier, TypeScript）
- 単体テスト + カバレッジレポート
- E2Eテスト（複数ブラウザ）
- セキュリティ監査
- 自動デプロイ

## 開発ガイドライン

### コミット前の必須チェック

**以下のコマンドを順番に実行してください：**

```bash
# 1. コードの自動整形
npm run format

# 2. リント検査
npm run lint

# 3. 型チェック
npx tsc --noEmit

# 4. テスト実行
npm run test

# 5. ビルド確認
npm run build
```

または一括実行：

```bash
npm run quality:check
```

### コーディング規約

- TypeScriptを使用し、厳密な型定義を心がける
- ESLint + Prettierの設定に従う
- コンポーネントは関数コンポーネントで実装
- カスタムフックでロジックを分離
- CSS Modulesでスタイルのカプセル化
- Next.js Imageコンポーネントで画像最適化
- テストファーストで開発（TDD推奨）

## ライセンス

© 2024 読書管理. All rights reserved.
