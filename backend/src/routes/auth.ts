import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { prisma } from '../lib/prisma'
import {
  badRequestError,
  unauthorizedError,
  conflictError,
  notFoundError,
  internalServerError,
} from '../middlewares/setErrorHandling'

const auth = new Hono()

// JWT設定（強力な秘密鍵）
const JWT_SECRET =
  process.env.JWT_SECRET ||
  'your-development-secret-key-should-be-256-bits-long-for-production-security'
const ACCESS_TOKEN_EXPIRES_IN = 60 * 15 // 15分（秒単位）
const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 7 // 7日間（秒単位）

// JWT Payload型定義
interface JwtPayload {
  id: number
  email: string
  username: string
  type: 'access' | 'refresh'
}

// 管理者ユーザー登録
auth.post('/register', async (c) => {
  try {
    const { email, username, password } = await c.req.json()

    // バリデーション
    if (!email || !username || !password) {
      return badRequestError(c, 'Email、ユーザー名、パスワードは必須です')
    }

    if (password.length < 6) {
      return badRequestError(c, 'パスワードは6文字以上である必要があります')
    }

    if (username.length > 20) {
      return badRequestError(c, 'ユーザー名は20文字以内である必要があります')
    }

    // 簡単なメールアドレス検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return badRequestError(c, '有効なメールアドレスを入力してください')
    }

    // 既存ユーザーチェック（Raw SQL - 意図的にインデックス不足で遅い）
    const existingUsers = (await prisma.$queryRaw`
      SELECT id, email, username
      FROM admin_users
      WHERE email = ${email} OR username = ${username}
      LIMIT 1
    `) as any[]

    if (existingUsers.length > 0) {
      return conflictError(c, 'このメールアドレスまたはユーザー名は既に使用されています')
    }

    // Bunのパスワードハッシュ化
    const passwordHash = await Bun.password.hash(password)

    // ユーザー作成（Raw SQL - RETURNINGで効率的に取得）
    const adminUsers = (await prisma.$queryRaw`
      INSERT INTO admin_users (email, username, password_hash, created_at, updated_at)
      VALUES (${email}, ${username}, ${passwordHash}, NOW(), NOW())
      RETURNING id, email, username, created_at
    `) as any[]

    if (!adminUsers || adminUsers.length === 0) {
      return internalServerError(c, 'ユーザーの作成に失敗しました')
    }

    const adminUser = adminUsers[0]

    // JWT発行（アクセストークン・リフレッシュトークン）
    const accessToken = await sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        type: 'access',
      },
      JWT_SECRET,
    )

    const refreshToken = await sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        type: 'refresh',
      },
      JWT_SECRET,
    )

    // セキュアなCookie設定でリフレッシュトークンを送信
    c.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_EXPIRES_IN,
      path: '/',
    })

    return c.json(
      {
        message: 'ユーザー登録が完了しました',
        user: adminUser,
        accessToken,
        // リフレッシュトークンはCookieで送信するためレスポンスには含めない
      },
      201,
    )
  } catch (error) {
    return internalServerError(c, error)
  }
})

// ログイン
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()

    // バリデーション
    if (!email || !password) {
      return badRequestError(c, 'メールアドレスとパスワードは必須です')
    }

    // ユーザー検索（Raw SQL - emailでの単純検索）
    const adminUsers = (await prisma.$queryRaw`
      SELECT id, email, username, password_hash, created_at
      FROM admin_users
      WHERE email = ${email}
    `) as any[]

    if (!adminUsers || adminUsers.length === 0) {
      return unauthorizedError(c, 'メールアドレスまたはパスワードが間違っています')
    }

    const adminUser = adminUsers[0]

    // パスワード検証
    const isPasswordValid = await Bun.password.verify(password, adminUser.password_hash)

    if (!isPasswordValid) {
      return unauthorizedError(c, 'メールアドレスまたはパスワードが間違っています')
    }

    // JWT発行（アクセストークン・リフレッシュトークン）
    const accessToken = await sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        type: 'access',
      },
      JWT_SECRET,
    )

    const refreshToken = await sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        type: 'refresh',
      },
      JWT_SECRET,
    )

    // セキュアなCookie設定でリフレッシュトークンを送信
    c.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_EXPIRES_IN,
      path: '/',
    })

    return c.json({
      message: 'ログインしました',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        created_at: adminUser.created_at,
      },
      accessToken,
      // リフレッシュトークンはCookieで送信するためレスポンスには含めない
    })
  } catch (error) {
    return internalServerError(c, error)
  }
})

// 現在のユーザー情報取得（認証必須）
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedError(c, '認証が必要です')
    }

    const token = authHeader.substring(7)

    const decoded = (await verify(token, JWT_SECRET)) as JwtPayload

    // アクセストークンのみ受け付ける
    if (decoded.type !== 'access') {
      return unauthorizedError(c, '無効なトークンタイプです')
    }

    // 認証ユーザー情報取得（Raw SQL - 意図的に非効率なJOIN・サブクエリを含む）
    const adminUsers = (await prisma.$queryRaw`
      SELECT
        au.id,
        au.email,
        au.username,
        au.created_at,
        au.updated_at,
        -- 仮想ユーザー情報を非効率なサブクエリで取得（学習用）
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', vu.id,
              'name', vu.name,
              'personality', vu.personality,
              'totalTweets', vu.total_tweets,
              'totalFollowers', vu.total_followers,
              'totalFollowing', vu.total_following
            )
          )
          FROM virtual_users vu
          WHERE vu.admin_user_id = au.id
        ) as virtual_users
      FROM admin_users au
      WHERE au.id = ${decoded.id}
    `) as any[]

    if (!adminUsers || adminUsers.length === 0) {
      return notFoundError(c, 'ユーザーが見つかりません')
    }

    return c.json({
      user: adminUsers[0],
    })
  } catch (error) {
    console.error('認証エラー:', error)
    return unauthorizedError(c, '認証に失敗しました')
  }
})

// リフレッシュトークンでアクセストークンを更新
auth.post('/refresh', async (c) => {
  try {
    // Cookieからリフレッシュトークンを取得
    const refreshToken = c.req.cookie('refreshToken')

    if (!refreshToken) {
      return unauthorizedError(c, 'リフレッシュトークンが必要です')
    }

    const decoded = (await verify(refreshToken, JWT_SECRET)) as JwtPayload

    // リフレッシュトークンのみ受け付ける
    if (decoded.type !== 'refresh') {
      return unauthorizedError(c, '無効なトークンタイプです')
    }

    // ユーザーが存在するか確認
    const adminUsers = (await prisma.$queryRaw`
      SELECT id, email, username
      FROM admin_users
      WHERE id = ${decoded.id}
    `) as any[]

    if (!adminUsers || adminUsers.length === 0) {
      return unauthorizedError(c, 'ユーザーが見つかりません')
    }

    const adminUser = adminUsers[0]

    // 新しいアクセストークンを発行
    const newAccessToken = await sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        type: 'access',
      },
      JWT_SECRET,
    )

    return c.json({
      message: 'トークンを更新しました',
      accessToken: newAccessToken,
    })
  } catch (error) {
    console.error('トークン更新エラー:', error)
    return unauthorizedError(c, 'トークンの更新に失敗しました')
  }
})

// ログアウト（リフレッシュトークンをクリア）
auth.post('/logout', async (c) => {
  try {
    // リフレッシュトークンCookieをクリア
    c.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    return c.json({
      message: 'ログアウトしました',
    })
  } catch (error) {
    console.error('ログアウトエラー:', error)
    return internalServerError(c, 'ログアウトに失敗しました')
  }
})

export default auth
