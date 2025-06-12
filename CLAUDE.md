# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## 🚨 重要：必須遵守事項

### 言語ルール
**すべての回答・説明・コメントは日本語で行うこと。**
- コードコメントも日本語で記述
- エラーメッセージの説明も日本語
- 技術用語は適切な日本語訳を使用

### ルール自動追加システム
「今回限りではなく常に適用が必要」と思われる指示を受けた場合：

1. **確認フェーズ**
   ```
   これを標準ルールにしますか？
   ```

2. **承認時の処理**（「YES」の回答時）
   - 該当指示をこのCLAUDE.mdに追記
   - カテゴリー別に整理して追加
   - 指示内容と説明を明記

3. **適用フェーズ**
   - 以降すべての作業で標準ルールとして適用

## プロジェクト概要

### アプリケーション目的
**SQLパフォーマンスチューニング練習用SNSアプリケーション**

- 意図的にパフォーマンス問題を含むSNSアプリ
- 開発者がfork/cloneして改善学習に使用
- AIによる仮想ユーザーが自動でツイート・フォロー・リアクション

### 設計思想
- **学習目的優先**：パフォーマンス問題を意図的に組み込み
- **実践的体験**：100万行規模のデータでパフォーマンス差を体感
- **段階的改善**：N+1問題、インデックス不足、正規化不足等のアンチパターンを教材化

**⚠️ 新機能実装時は必ず `app-development-interview.md` を参照**

## 技術スタック・構成

### モノレポ構成
```
/
├── frontend/     # React + TypeScript + Vite
├── backend/      # Hono API サーバー
└── (ルート)       # Biome設定、共通スクリプト
```

### 技術選択の理由
- **パッケージ管理**: Bun（高速性・ES modules対応）
- **コード品質**: Biome（統一フォーマット・リント）
- **状態管理**: Jotai + TanStack Query（フロントエンド）
- **API**: Hono（軽量・高速）
- **DB**: Supabase + Prisma（ORM併用だがSQL直書き方針）

## 🔧 開発ルール・基準

### Docker Compose運用ルール

#### 動作確認前のポート確認（必須）
Docker Compose起動前には必ずポートの空き状況を確認し、適切な対応を行うこと。

**確認コマンド**:
```bash
# 必要なポートの確認
lsof -i :80 -i :3000 -i :3001 -i :5432

# または個別確認
lsof -i :80    # nginx用（本番）
lsof -i :3000  # バックエンド開発用
lsof -i :3001  # フロントエンド開発用  
lsof -i :5432  # PostgreSQL用
```

**対応ルール**:
1. **ポートマッピング変更は禁止** - docker-compose.ymlのポート設定は変更しない
2. **プロセス停止前の確認** - 使用中プロセスを発見した場合：
   - プロセス詳細を表示
   - 停止しても良いかユーザーに確認を求める
   - 承認後にプロセス停止を実行
3. **確認なし停止の禁止** - ユーザー確認なしでの`kill`コマンド実行は禁止

#### 動作確認後のクリーンアップ（必須）
- **コンテナ停止** - Docker Composeでの動作確認後は必ず`docker-compose down`でコンテナを停止する

### TypeScript開発規約

#### インポート拡張子ルール
```typescript
// ✅ 正しい（拡張子なし）
import { corsMiddleware } from './corsMiddleware'

// ❌ 間違い
import { corsMiddleware } from './corsMiddleware.js'
```

**理由**: Bunランタイムが拡張子なしインポートをサポートし、TypeScript標準の書き方を維持

#### Prisma使用方針
- **永続化処理**: Prismaを使用
- **クエリー記述**: SQLを直接記述（Prismaクエリービルダー不使用）
- **目的**: SQLパフォーマンス学習のため

### Git管理規約

#### コミット頻度
- タスクごとに細かくコミット
- 意味のある単位でまとめる
- 機能単位・修正単位で区切る

#### コミットメッセージ形式
```
種別: 簡潔な説明

詳細説明（必要に応じて）

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

#### 機密情報管理
- `.env.local`、`.env.*.local` を必ずGitignore
- 環境変数・秘密鍵は絶対にコミット禁止
- 設定ファイルには例・ダミー値のみ

## 🚀 開発コマンド

### モノレポ全体
```bash
# コードフォーマット
bun run format

# フォーマットチェック
bun run format:check  

# リント
bun run lint

# リント自動修正
bun run lint:fix

# 全チェック・修正
bun run check:fix
```

### フロントエンド (frontend/)
```bash
# 開発サーバー
bun run dev

# 本番ビルド
bun run build

# 型チェック
bun run check-types

# プレビュー
bun run start
```

### バックエンド (backend/)
```bash
# 開発サーバー（ホットリロード）
bun run dev

# ビルド
bun run build

# 本番起動
bun run start

# テスト
bun run test
```

## 🏗️ アーキテクチャ詳細

### フロントエンド設計
- **状態管理**: Jotai（アトミック） + TanStack Query（サーバー状態）
- **認証**: Supabase Auth（`/features/auth/`）
- **ルーティング**: React Router（`/components/layouts/`）
- **UI**: Tailwind CSS（`/components/ui/`）
- **API**: 一元化クライアント（`/api/api-client.ts`）

### バックエンド設計
- **フレームワーク**: Hono（ミドルウェアパターン）
- **ミドルウェア**: `/middlewares/`（CORS、ログ、セキュリティ）
- **アプリ設定**: `app.ts`の`createApp()`で一元化

### 外部連携
- **データベース**: Supabase（環境変数: VITE_SUPABASE_URL、VITE_SUPABASE_ANON_KEY）
- **AI**: OpenAI API（ツイート生成、フォロー・リツイート判定）
- **デプロイ**: Docker（バックエンド）、Render（フロントエンド）

## 📊 コード品質・テスト

### 品質管理
- **Biome設定**: 100文字行幅、厳格なTypeScriptルール
- **プリコミット**: Husky + lint-staged（自動フォーマット・リント）

### テスト環境
- **フロントエンド**: Vitest + HappyDOM
- **バックエンド**: Bun test

## 📋 パフォーマンス学習要素

### 意図的なアンチパターン
- N+1問題の実装
- インデックス不足
- 正規化不足
- 非効率なクエリ設計

### 学習目標
- 100万行規模でのパフォーマンス差体感
- 段階的改善による学習効果
- 実践的なチューニング経験

---

## 📝 標準ルール追加履歴
<!-- 承認された標準ルールはここに自動追加されます -->
