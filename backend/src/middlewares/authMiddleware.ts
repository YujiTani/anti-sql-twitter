import { Context, Next } from 'hono'
import { verify } from 'jsonwebtoken'
import { unauthorizedError } from './setErrorHandling'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthPayload {
  id: number
  email: string
  username: string
}

// 認証情報をContextに追加する型拡張
declare module 'hono' {
  interface ContextVariableMap {
    user: AuthPayload
  }
}

/**
 * JWT認証ミドルウェア
 * Authorization: Bearer <token> でJWT検証を行う
 */
export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedError(c, '認証トークンが必要です')
    }

    const token = authHeader.substring(7)
    const decoded: AuthPayload = verify(token, JWT_SECRET)
    c.set('user', decoded)
    await next()
    return
  } catch (error) {
    return unauthorizedError(c, '無効な認証トークンです')
  }
}
