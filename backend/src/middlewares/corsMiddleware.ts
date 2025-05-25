import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'

// CORSの設定
export const corsMiddleware = () => {
  if (!process.env.ORIGIN) {
    throw new Error('環境変数ORIGINを設定してください')
  }

  return cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.ORIGIN : '*',
    // プリフライトリクエストの結果をキャッシュする時間（秒）
    maxAge: 600,
    // 認証情報（Cookie、Authorization header）の送信を許可
    credentials: process.env.NODE_ENV === 'production',
  })
}
