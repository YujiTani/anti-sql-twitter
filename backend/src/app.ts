import { Hono } from 'hono'
import setErrorHandling from './middlewares/setErrorHandling'
import { setMiddlewares } from './middlewares/setMiddleware'

// Appオブジェクトを作成
function createApp() {
  const app = new Hono()
  setMiddlewares(app)
  setErrorHandling(app)

  // ルーティングの設定をする関数を呼ぶ
  // 動作確認用API
  app.get('/health', (c) => {
    return c.json({ status: 'ok' })
  })

  return app
}

export default createApp
