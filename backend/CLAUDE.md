# backend/CLAUDE.md

このファイルは、バックエンド開発における専用ガイダンスを提供します。

**📁 階層ルール**: プロジェクト全体の共通ルールは `/CLAUDE.md` を参照してください。

## ⚙️ バックエンド技術スタック

### 核となる技術

- **Hono**: 軽量・高速WebAPIフレームワーク
- **TypeScript**: 型安全なサーバーサイド開発
- **Bun**: 高速ランタイム・パッケージマネージャー
- **PostgreSQL**: メインデータベース（Supabase）

### データベース・ORM

- **Prisma**: スキーマ管理・マイグレーション
- **Raw SQL方針**: クエリビルダー不使用、SQL直書き
- **意図的非効率化**: SQLパフォーマンス学習のため

## 🏗️ アーキテクチャ・ディレクトリ構成

### ディレクトリ構造

```
src/
├── app.ts              # Honoアプリケーション設定
├── main.ts             # サーバー起動エントリーポイント
├── lib/                # 外部ライブラリ設定
│   └── prisma.ts       # Prismaクライアント設定
├── middlewares/        # Honoミドルウェア
│   ├── authMiddleware.ts       # JWT認証
│   ├── corsMiddleware.ts       # CORS設定
│   ├── requestLoggerMiddleware.ts # リクエストログ
│   ├── secureHeadersMiddleware.ts # セキュリティヘッダー
│   └── setErrorHandling.ts    # エラーハンドリング
├── routes/             # APIルート定義
│   └── auth.ts         # 認証関連API
└── types/              # 型定義
    └── errorTypes.ts   # エラー型定義
```

### 設計原則

- **ミドルウェアパターン**: 横断的関心事の分離
- **機能別ルート**: `/routes/` で機能ごとにAPI分割
- **型安全性**: TypeScriptによる厳格な型チェック

## 🔧 開発ルール・規約

### TypeScript規約

#### インポート拡張子ルール

```typescript
// ✅ 正しい（拡張子なし）
import { corsMiddleware } from './corsMiddleware'
import { authMiddleware } from '../middlewares/authMiddleware'

// ❌ 間違い
import { corsMiddleware } from './corsMiddleware.js'
import { authMiddleware } from '../middlewares/authMiddleware.ts'
```

**理由**: Bunランタイムが拡張子なしインポートをサポートし、TypeScript標準の書き方を維持

#### 型定義の配置

- **エラー型**: `/types/errorTypes.ts`
- **API型**: バックエンド独自定義、フロントエンドと同期
- **ミドルウェア型**: 各ミドルウェアファイル内で定義

### API設計規約

#### RESTful API設計

```typescript
// ✅ 正しいAPI設計
app.get('/api/users/:id', getUserHandler)           // 取得
app.post('/api/users', createUserHandler)          // 作成
app.put('/api/users/:id', updateUserHandler)       // 更新
app.delete('/api/users/:id', deleteUserHandler)    // 削除

// ✅ ネストしたリソース
app.get('/api/users/:id/tweets', getUserTweetsHandler)
```

#### レスポンス形式の統一

```typescript
// ✅ 成功レスポンス
return c.json({
  data: result,
  message: 'ユーザー取得に成功しました'
}, 200)

// ✅ エラーレスポンス（統一形式）
return createErrorResponse(c, error, HTTP_STATUS.BAD_REQUEST, 'バリデーションエラー')
```

### 認証・セキュリティ規約

#### JWT認証実装

```typescript
// ✅ JWT payload型定義
interface JwtPayload {
  id: number
  email: string
  username: string
}

// ✅ 認証ミドルウェア使用
app.use('/api/protected/*', authMiddleware)

// ✅ 認証済みユーザー情報取得
app.get('/api/protected/profile', (c) => {
  const user = c.get('user') // authMiddlewareで設定
  return c.json({ user })
})
```

#### パスワードハッシュ化

```typescript
// ✅ Bunのパスワード機能使用
const passwordHash = await Bun.password.hash(password)
const isValid = await Bun.password.verify(password, passwordHash)
```

### エラーハンドリング規約

#### 統一エラーレスポンス

```typescript
import { HTTP_STATUS, createErrorResponse } from '../types/errorTypes'

// ✅ 型安全なエラーレスポンス
export const badRequestError = (c: Context, message: string) => {
  return createErrorResponse(c, { message }, HTTP_STATUS.BAD_REQUEST, `Bad Request: ${message}`)
}

// ✅ カスタムエラーメッセージ
return createErrorResponse(c, error, { 
  code: HTTP_STATUS.UNAUTHORIZED, 
  message: "Unauthorized: 認証トークンが無効です" 
})
```

#### エラー型定義

```typescript
// ✅ アプリケーション専用エラー型
export type ErrorStatusCode = 400 | 401 | 403 | 404 | 409 | 500

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const
```

## 🗃️ データベース・Prisma運用

### Prisma使用方針

- **永続化処理**: Prismaを使用
- **クエリ記述**: SQLを直接記述（Raw SQL）
- **目的**: SQLパフォーマンス学習のため

#### Raw SQL実装パターン

```typescript
// ✅ Raw SQLでの実装
const users = await prisma.$queryRaw`
  SELECT id, email, username, created_at
  FROM admin_users 
  WHERE email = ${email}
`

// ✅ 意図的に非効率なクエリ（学習用）
const userWithVirtualUsers = await prisma.$queryRaw`
  SELECT 
    au.id, au.email, au.username,
    -- 非効率なサブクエリ（N+1問題誘発）
    (
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT('id', vu.id, 'name', vu.name)
      )
      FROM virtual_users vu 
      WHERE vu.admin_user_id = au.id
    ) as virtual_users
  FROM admin_users au
  WHERE au.id = ${userId}
`
```

#### データベーススキーマ管理

```bash
# スキーマ変更をデータベースに反映
bun run db:push

# 新しいマイグレーション作成
bunx prisma migrate dev --name <migration-name>

# Prismaクライアント再生成
bunx prisma generate
```

### パフォーマンス学習要素の実装

#### 意図的なアンチパターン

```typescript
// ❌ N+1問題（学習用）
const tweets = await prisma.$queryRaw`SELECT * FROM tweets LIMIT 100`
for (const tweet of tweets) {
  // 各ツイートごとにユーザー情報を取得（N+1問題）
  const user = await prisma.$queryRaw`
    SELECT name FROM virtual_users WHERE id = ${tweet.virtual_user_id}
  `
}

// ❌ インデックス不足による全表スキャン（学習用）
const searchResults = await prisma.$queryRaw`
  SELECT * FROM tweets 
  WHERE content LIKE '%${keyword}%'  -- インデックスが効かない
`
```

## 🚀 開発コマンド

### 日常開発コマンド

```bash
# 開発サーバー（ホットリロード）
bun run dev

# TypeScriptビルド
bun run build

# 本番起動
bun run start

# テスト実行
bun run test
```

### データベース操作

```bash
# スキーマをデータベースに反映
bun run db:push

# データベースリセット（開発時）
bunx prisma migrate reset

# Prisma Studio起動
bunx prisma studio
```

## 🔒 セキュリティ・認証

### セキュリティミドルウェア

```typescript
// ✅ セキュリティヘッダー設定
app.use('*', secureHeadersMiddleware)

// ✅ CORS設定
app.use('*', corsMiddleware)

// ✅ リクエストログ
app.use('*', requestLoggerMiddleware)
```

### 環境変数管理

```typescript
// ✅ 環境変数の型安全な取得
const JWT_SECRET = process.env.JWT_SECRET || 'development-only-secret'
const DATABASE_URL = process.env.DATABASE_URL

// ❌ 機密情報をログ出力
console.log('JWT_SECRET:', JWT_SECRET) // 絶対にNG
```

### 認証フロー

1. **ユーザー登録**: メール・ユーザー名・パスワード
2. **パスワードハッシュ化**: Bun.password.hash()
3. **JWT発行**: ログイン時にトークン生成
4. **認証検証**: authMiddlewareでトークン検証
5. **保護されたルート**: 認証必須エンドポイント

## 🧪 テスト規約

### テストファイル配置

```
src/
├── routes/
│   ├── auth.ts
│   └── auth.test.ts        # 同じディレクトリに配置
├── middlewares/
│   ├── authMiddleware.ts
│   └── authMiddleware.test.ts
```

### API テストパターン

```typescript
// ✅ API エンドポイントテスト
import { testClient } from 'hono/testing'
import { createApp } from '../app'

describe('認証API', () => {
  const app = createApp()
  const client = testClient(app)

  test('ユーザー登録が成功する', async () => {
    const res = await client.api.auth.register.$post({
      json: {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      }
    })
    
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.user.email).toBe('test@example.com')
  })
})
```

## 📊 パフォーマンス監視

### ログ・監視実装

```typescript
// ✅ パフォーマンス計測
export const performanceMiddleware = async (c: Context, next: Next) => {
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  
  console.log(`[PERF] ${c.req.method} ${c.req.path} - ${duration}ms`)
}

// ✅ データベースクエリ実行時間計測
const startTime = Date.now()
const result = await prisma.$queryRaw`SELECT * FROM tweets`
const queryTime = Date.now() - startTime
console.log(`[DB] クエリ実行時間: ${queryTime}ms`)
```

---

## 📝 バックエンド専用ルール追加履歴
<!-- バックエンド固有の標準ルールはここに自動追加されます -->

### エラーハンドリング規約

- **統一エラー型定義**: HTTP_STATUSとErrorStatusCode型による型安全なエラーレスポンス
- **カスタムエラーメッセージ対応**: statusInfoオブジェクトによる柔軟なメッセージ設定

### JWT認証セキュリティルール

- **リフレッシュトークンHttpOnly Cookie**: リフレッシュトークンは必ずHttpOnly Cookieで管理
- **セキュアCookie設定**: `httpOnly: true`, `secure: true`（本番）, `sameSite: 'strict'`を必須設定
- **トークン分離**: アクセストークン（短期・メモリ）とリフレッシュトークン（長期・Cookie）の適切な分離
- **認証ログ出力**: 認証成功・失敗時のログ出力を必須化（セキュリティ監査用）
