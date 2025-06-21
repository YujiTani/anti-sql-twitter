import { Context, Next } from 'hono'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { unauthorizedError } from './setErrorHandling'

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'your-development-secret-key-should-be-256-bits-long-for-production-security'

export interface AuthPayload {
  id: number
  email: string
  username: string
  type: 'access' | 'refresh'
  iat: number
  exp: number
}

// HonoのJWTミドルウェアを設定
export const authMiddleware = jwt({
  secret: JWT_SECRET,
})

// カスタム認証ミドルウェア（アクセストークンのみ許可）
export const accessTokenMiddleware = async (c: Context, next: Next) => {
  try {
    const payload = c.get('jwtPayload') as AuthPayload

    if (!payload) {
      return unauthorizedError(c, '認証が必要です')
    }

    // アクセストークンのみ許可
    if (payload.type !== 'access') {
      return unauthorizedError(c, '無効なトークンタイプです')
    }

    console.log(`認証成功: ユーザーID=${payload.id}, Email=${payload.email}`)
    await next()
  } catch (error) {
    console.error('認証ミドルウェアエラー:', error)
    return unauthorizedError(c, '認証に失敗しました')
  }
}
