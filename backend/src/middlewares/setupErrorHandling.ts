import { Context, Hono } from "hono"
import { nanoid } from "nanoid";

// グローバルエラーハンドリング設定
const setupErrorHandling = (app: Hono) => {
    // グローバルエラーハンドラー
    app.onError((err, c: Context) => {
      const requestId = c.get('requestId') || nanoid();
      const requestTimeStamp = c.get('requestTime') || new Date().toISOString();
      console.error(`[GLOBAL_ERROR] ${requestTimeStamp} [${requestId}] ← ${err}`)
      return c.json({
        error: 'Internal Server Error',
        message: err.message || 'An unexpected error occurred',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        requestId,
      }, 500)
    })
    
    // 404ハンドラー
    app.notFound((c: Context) => {
      const requestId = c.get('requestId') || nanoid();
      const requestTimeStamp = c.get('requestTime') || new Date().toISOString();
      console.log(`[NOT FOUND] ${requestTimeStamp} [${requestId}] ← ${c.req.method} ${c.req.url}`);
      return c.json({
        error: 'Not Found',
        requestId,
      }, 404)
    })
  }

export default setupErrorHandling;