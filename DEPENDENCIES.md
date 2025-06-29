# 依存関係の説明

このドキュメントでは、プロジェクトの依存関係とその使用目的について説明します。

## DevDependencies

### テスト関連

#### `@testing-library/user-event`
- **用途**: ユーザーインタラクション（クリック、キーボード入力など）のシミュレーション
- **使用場所**: テストファイル内で動的にインポート
- **なぜ必要**: より現実的なユーザー操作テストを実現

#### `@types/jest`
- **用途**: Jest の TypeScript 型定義
- **使用場所**: グローバルに利用（Jest設定により自動適用）
- **なぜ必要**: TypeScript環境でJestのAPIに型安全性を提供

#### `jest-environment-jsdom`
- **用途**: Jest でブラウザ環境をシミュレーション
- **使用場所**: `jest.config.js` の `testEnvironment` 設定
- **なぜ必要**: React コンポーネントのテストにDOM環境が必要

### 開発・ビルド関連

#### `@types/node`
- **用途**: Node.js の TypeScript 型定義
- **使用場所**: Next.js設定ファイル、ビルドスクリプトなど
- **なぜ必要**: Node.js API使用時の型安全性を提供

#### `depcheck`
- **用途**: 未使用依存関係の検出
- **使用場所**: CI/CDパイプライン、開発時の品質チェック
- **なぜ必要**: 依存関係の肥大化を防ぎ、bundle sizeを最適化

## Depcheck設定の説明

`.depcheckrc.json` で以下の設定を行っています：

### `ignores` 配列
グローバルに利用される、または間接的に使用される依存関係を無視します：

- `@testing-library/user-event`: テスト内で動的インポート
- `@types/jest`: Jest設定により自動適用
- `@types/node`: TypeScriptコンパイラが自動参照
- `jest-environment-jsdom`: Jest設定ファイルで指定
- `depcheck`: 自己参照（depcheck自体をチェックしないため）

### `ignore-matches` 配列
特定のパターンのファイルでの未使用警告を無視：

- `@types/*`: 型定義パッケージは明示的にimportしない
- テストディレクトリ: テスト専用の依存関係

## CI/CDでの使用

GitHub Actions では以下のように使用されます：

```yaml
- name: Run dependency check
  run: npm run depcheck
```

これにより、プルリクエスト時に不要な依存関係が追加されることを防げます。

## 手動チェック

開発中に依存関係をチェックしたい場合：

```bash
npm run depcheck
```

問題がない場合は "No depcheck issue" と表示されます。