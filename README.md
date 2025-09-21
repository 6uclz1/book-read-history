# 読書管理アプリ

読んだ本を記録・管理するNext.js製のWebアプリケーションです。モバイル/デスクトップ双方で快適に利用でき、Tailwind CSSによる柔軟なUIカスタマイズにも対応しています。

## 主な機能

- **本の一覧表示**: 読了した本をグリッド形式で表示
- **年別フィルタリング**: 読了年（2015年〜2024年）で絞り込み
- **無限スクロール**: 48冊ずつ段階的に読み込み
- **詳細ページ**: 著者・出版社・ISBN・読了日などを表示
- **アクセシビリティ**: キーボード操作とARIA属性に対応

## 技術スタック

- **フレームワーク**: Next.js 15.x (App Router未使用のPages構成)
- **言語**: TypeScript 5.9（strictモード）
- **スタイリング**: Tailwind CSS + カスタムクラス
- **リンター/フォーマッター**: Biome (lint / format)
- **データ加工**: Node.jsスクリプト `convert.js`

## セットアップ

### 前提条件
- Node.js 18以上
- npm

### インストールと開発開始
```bash
git clone <repository-url>
cd book-read-history
npm install
npm run dev
```
http://localhost:3000 でアプリを確認できます。

## 利用可能なコマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド生成
npm start            # 本番ビルドを起動
npm run lint         # BiomeでLintチェック
npm run lint:fix     # Lint違反の自動修正
npm run format       # Biomeで整形のみ実行
npm run convert      # CSV→TypeScriptデータ変換
npm run books:update # convertと同じ処理（エイリアス）
```

## データ管理

1. `public/books.csv` に新しい本の情報を追記
2. 必要なら `public/highlights.csv` も更新
3. `npm run convert` で `public/books.ts` などの型付きデータを再生成
4. 年の追加がある場合は `src/pages/index.tsx` のフィルターリストを更新

TypeScriptで扱う本データは `src/types/book.ts` に定義されています。

```typescript
export interface Highlight {
  text: string;
  location: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  asin: string | null;
  readDate: string;
  thumbnailImage: string;
  highlights: Highlight[];
}
```

## プロジェクト構造

```
├── src/
│   ├── pages/           # Next.jsページ（ルーティング）
│   ├── components/      # UIコンポーネント
│   ├── hooks/           # カスタムフック
│   ├── styles/          # グローバルスタイル
│   └── types/           # 型定義
├── public/              # 画像・データCSV/TS
├── convert.js           # データ変換スクリプト
├── export.json          # CSVエクスポート設定
├── AGENTS.md            # コントリビューター向けガイドライン
└── package.json
```

## コントリビューションガイド

開発方針・コーディング規約・レビュー手順については [AGENTS.md](./AGENTS.md) を参照してください。コミット前に `npm run lint` と `npm run build` の完走を確認するとスムーズです。

## デプロイ

[Vercel](https://vercel.com/) へのデプロイを推奨しています。GitHubリポジトリを接続すると自動ビルド・プレビューが利用できます。詳細は [Next.js deployment documentation](https://nextjs.org/docs/deployment) を参照してください。

## ライセンス

© 2024 読書管理. All rights reserved.
