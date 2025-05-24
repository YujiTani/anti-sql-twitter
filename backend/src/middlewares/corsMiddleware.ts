import { cors } from "hono/cors";

// CORSの設定
export const corsMiddleware = cors({
    origin: process.env.NODE_ENV === 'production' 
    ? process.env.ORIGIN || '*'
    : '*',
    // プリフライトリクエストの結果をキャッシュする時間（秒）
    maxAge: 600,
    // 認証情報（Cookie、Authorization header）の送信を許可
    credentials: process.env.NODE_ENV === 'production',
})