# 読書管理アプリ テスト実装

このドキュメントでは、読書管理アプリに実装されたテストシステムについて説明します。

## テスト戦略

t-wadaさんのアプローチに基づき、以下の3層テスト戦略を採用しています：

### 1. ユニットテスト (Unit Tests)
- **フレームワーク**: Jest + React Testing Library
- **対象範囲**: 70% 以上のコードカバレッジ
- **対象コンポーネント**:
  - `BookCard`: 本の情報表示とインタラクション
  - `YearFilter`: 年度フィルタリング機能
  - `useBookFilter`: 本のフィルタリングロジック
  - `useInfiniteScroll`: 無限スクロール機能

### 2. 統合テスト (Integration Tests)
- **対象**: ページ全体の機能
- **カバー範囲**: 主要機能の100%
- **テスト内容**:
  - ページ表示
  - フィルタリング機能
  - ナビゲーション
  - アクセシビリティ

### 3. E2Eテスト (End-to-End Tests)
- **フレームワーク**: Playwright
- **対象**: クリティカルなユーザージャーニー
- **カバー範囲**: 主要パスの100%
- **テスト内容**:
  - 基本的なページナビゲーション
  - 年度フィルタリングの動作
  - ブック詳細ページへの遷移
  - レスポンシブデザインの確認

## テストファイル構成

```
__tests__/
├── components/
│   ├── BookCard.test.tsx       # BookCardコンポーネントのテスト
│   └── YearFilter.test.tsx     # YearFilterコンポーネントのテスト
├── hooks/
│   ├── useBookFilter.test.ts   # useBookFilterフックのテスト
│   └── useInfiniteScroll.test.ts # useInfiniteScrollフックのテスト
└── pages/
    └── index.test.tsx          # メインページの統合テスト

e2e/
├── home-page.spec.ts           # ホームページのE2Eテスト
├── book-detail.spec.ts         # 本詳細ページのE2Eテスト
└── year-filtering.spec.ts      # 年度フィルタリング機能のE2Eテスト
```

## 設定ファイル

### Jest設定 (`jest.config.js`)
- Next.js との統合
- TypeScript サポート
- カバレッジ設定（70%の閾値）
- モジュールマッピング
- セットアップファイル

### Playwright設定 (`playwright.config.ts`)
- マルチブラウザテスト（Chrome, Firefox, Safari）
- モバイルビューポートテスト
- 自動開発サーバー起動
- トレース・レポート機能

### テストセットアップ (`jest.setup.js`)
- React Testing Library の設定
- Next.js ルーターのモック
- Next.js Image コンポーネントのモック
- IntersectionObserver のモック
- MediaQuery のモック

## テストコマンド

### Jest (ユニット・統合テスト)
```bash
npm test                  # 全テスト実行
npm run test:watch        # ウォッチモードで実行
npm run test:coverage     # カバレッジレポート付きで実行
npm run test:ci          # CI用（カバレッジ・ウォッチなし）
```

### Playwright (E2Eテスト)
```bash
npm run test:e2e         # E2Eテスト実行
npm run test:e2e:ui      # UIモードで実行
npm run test:e2e:headed  # ブラウザ表示で実行
```

## テストのポイント

### アクセシビリティ重視
- ARIA属性の検証
- キーボードナビゲーションのテスト
- スクリーンリーダー対応の確認

### 実際のユーザー操作に近いテスト
- `getByRole` を優先使用
- ユーザーが見つけるであろう要素での検索
- 実際のクリック・キーボード操作

### モックの適切な利用
- 外部依存の分離
- テスト環境での安定した動作
- 実装詳細への過度な依存を避ける

## カバレッジ目標

- **ユニットテスト**: 70%以上（ステートメント、行、関数）、60%以上（ブランチ）
- **統合テスト**: 主要機能の100%
- **E2Eテスト**: クリティカルパスの100%

## CI/CD統合

テストは以下の場面で自動実行されます：
- プルリクエスト作成時
- メインブランチへのマージ時
- リリース前のチェック

## メンテナンス

### テストの追加指針
1. 新機能実装時は対応するテストを同時に作成
2. バグ修正時は回帰防止のテストを追加
3. アクセシビリティ機能の変更時は該当テストを更新

### パフォーマンス考慮
- テスト実行時間の監視
- 重複テストの削除
- モックの適切な使用でテスト高速化

## 参考資料

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/)
- [Jest](https://jestjs.io/)
- [Next.js Testing](https://nextjs.org/docs/testing)