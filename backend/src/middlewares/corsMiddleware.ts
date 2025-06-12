import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'

// CORSの設定
export const corsMiddleware = () => {
  // 環境変数ORIGINが設定されていない場合はエラーで停止
  if (!process.env.ORIGIN) {
    console.error(' 環境変数ORIGINが設定されていません。セキュリティのため必須です。')
    console.error('例: ORIGIN=http://localhost:3001 (開発環境)')
    console.error('例: ORIGIN=https://your-domain.com (本番環境)')
    throw new Error('Missing required environment variable: ORIGIN')
  }

  return cors({
    origin: process.env.ORIGIN,
    // プリフライトリクエストの結果をキャッシュする時間（秒）
    maxAge: 600,
    // 認証情報（Cookie、Authorization header）の送信を許可
    credentials: process.env.NODE_ENV === 'production',
  })
}
