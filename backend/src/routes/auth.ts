import { Hono } from 'hono'
import { sign, verify } from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import {
  badRequestError,
  unauthorizedError,
  conflictError,
  notFoundError,
  internalServerError,
} from '../middlewares/setErrorHandling'

const auth = new Hono()

// JWT設定
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '7d'

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

    // 既存ユーザーチェック（Raw SQL - 意図的にインデックス不足で遅い）
    const existingUser = await prisma.$queryRaw`
      SELECT id, email, username
      FROM admin_users
      WHERE email = ${email} OR username = ${username}
      LIMIT 1
    `

    if (existingUser.length > 0) {
      return conflictError(c, 'このメールアドレスまたはユーザー名は既に使用されています')
    }

    // Bunのパスワードハッシュ化
    const passwordHash = await Bun.password.hash(password)

    // ユーザー作成（Raw SQL - RETURNINGで効率的に取得）
    const adminUser = await prisma.$queryRaw`
      INSERT INTO admin_users (email, username, password_hash, created_at, updated_at)
      VALUES (${email}, ${username}, ${passwordHash}, NOW(), NOW())
      RETURNING id, email, username, created_at
    `

    if (!adminUser) {
      return internalServerError(c, 'ユーザーの作成に失敗しました')
    }

    // JWT発行
    const token = sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    )

    return c.json(
      {
        message: 'ユーザー登録が完了しました',
        user: adminUser,
        token,
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
    const adminUser = await prisma.$queryRaw`
      SELECT id, email, username, password_hash, created_at
      FROM admin_users
      WHERE email = ${email}
    `
    if (!adminUser) {
      return unauthorizedError(c, 'メールアドレスまたはパスワードが間違っています')
    }

    // パスワード検証
    const isPasswordValid = await Bun.password.verify(password, adminUser.passwordHash)

    if (!isPasswordValid) {
      return unauthorizedError(c, 'メールアドレスまたはパスワードが間違っています')
    }

    // JWT発行
    const token = sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    )

    return c.json({
      message: 'ログインしました',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        createdAt: adminUser.createdAt,
      },
      token,
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

    const decoded = Number(verify(token, JWT_SECRET))

    // 認証ユーザー情報取得（Raw SQL - 意図的に非効率なJOIN・サブクエリを含む）
    const adminUser = await prisma.$queryRaw`
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
    `

    if (!adminUser) {
      return notFoundError(c, 'ユーザーが見つかりません')
    }

    return c.json({
      user: adminUser,
    })
  } catch (error) {
    return unauthorizedError(c, '認証に失敗しました')
  }
})

export default auth
