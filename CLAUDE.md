# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のプロジェクト全体ガイダンスを提供します。

## 🚨 重要：必須遵守事項

### 言語ルール
**すべての回答・説明・コメントは日本語で行うこと。**
- コードコメントも日本語で記述
- エラーメッセージの説明も日本語
- 技術用語は適切な日本語訳を使用

### 📁 CLAUDE.md階層構造
プロジェクトでは複数のCLAUDE.mdファイルが階層的に管理されています：

- **`/CLAUDE.md`** (このファイル): プロジェクト全体の統括・共通ルール
- **`/frontend/CLAUDE.md`**: フロントエンド専用の開発ガイド
- **`/backend/CLAUDE.md`**: バックエンド専用の開発ガイド

**作業時のルール**:
1. 必ず該当ディレクトリのCLAUDE.mdを参照する
2. 共通ルールはこのファイル、専門ルールは各ディレクトリのファイルを確認
3. ルール追加時は適切なファイルに記録する
4. タスクが完了 or 私に確認が必要なことは以下のコマンドを実行する
※ message 部分は `タスク完了` or `相談したい内容があります` のどちらかに書き換えて実行すること 
```sh
osascript -e 'display notification message with title "Claude AI"'
``````

### 📝 ルール管理システム
重要な指示や制約を標準ルールとして管理するための実用的システム：

#### ルール追加の判断基準
以下のような指示を受けた場合、標準ルール化が有効：
- 繰り返し発生する可能性が高い作業手順
- プロジェクト全体に影響する制約や決まり事
- セキュリティ・品質に関わる必須事項
- 開発効率に大きく影響する作業ルール

#### ルール追加先の選択
- **プロジェクト全体・Docker・Git・モノレポ管理** → `/CLAUDE.md`
- **React・UI・状態管理・ビルド・テスト** → `/frontend/CLAUDE.md`  
- **API・データベース・認証・サーバー・型定義** → `/backend/CLAUDE.md`

#### 新ルール追加の手順
1. **重要度確認**: 一回限りでない、継続的に必要なルールか判断
2. **対象ファイル特定**: 上記基準に従って適切なCLAUDE.mdを選択
3. **既存ルール確認**: 重複や矛盾がないかチェック
4. **ルール記述**: 条件・手順・理由を明確に記載
5. **履歴記録**: ファイル末尾の「標準ルール追加履歴」に記録

## 📋 プロジェクト概要

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

## 🏗️ 技術スタック・構成

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
- **DB**: Prisma（ORM併用だがSQL直書き方針）

### 外部連携
- **データベース**: Supabase（環境変数: VITE_SUPABASE_URL、VITE_SUPABASE_ANON_KEY）
- **AI**: OpenAI API（ツイート生成、フォロー・リツイート判定）
- **デプロイ**: Docker（バックエンド）、Render（フロントエンド）

## 🔧 共通開発ルール

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
lsof -i :3001  # フロントエンド開発用’
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

### フロントエンド開発
```bash
# 開発サーバー起動
cd frontend
bun run dev

# ビルド
bun run build

# プレビュー
bun run preview

# テスト実行
bun test

# 型チェック
bun run type-check
```

### バックエンド開発
```bash
# 開発サーバー起動
cd backend
bun run dev

# ビルド
bun run build

# 本番起動
bun start

# テスト実行
bun test

# データベース操作
bun run db:generate  # Prismaクライアント生成
bun run db:push      # スキーマ反映
bun run db:migrate   # マイグレーション実行
bun run db:studio    # Prisma Studio起動
```

### Docker環境
```bash
# 全サービス起動
docker-compose up -d

# ログ確認
docker-compose logs -f

# 特定サービスのログ
docker-compose logs -f [service-name]

# サービス停止・削除
docker-compose down

# ボリューム含めて削除
docker-compose down -v

# リビルド
docker-compose build --no-cache
```

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

### Docker Compose運用ルール
- **ポートマッピング変更禁止**: docker-compose.ymlのポート設定変更を禁止し、プロセス停止での対応を義務化
- **動作確認後のクリーンアップ**: Docker Compose動作確認後の`docker-compose down`実行を必須化

### エラーメッセージ統一ルール
- **日本語メッセージ統一**: すべてのエラーメッセージ・通知メッセージは日本語で統一すること
- **ユーザビリティ重視**: 技術的詳細ではなく、ユーザーが理解しやすい表現を使用
- **一貫性維持**: 同じ種類のエラーは同じメッセージ形式を使用（例：「〇〇に失敗しました」）


