import { Hono } from 'hono'
import setErrorHandling from './middlewares/setErrorHandling'
import { setMiddlewares } from './middlewares/setMiddleware'
import os from 'os'

// Appオブジェクトを作成
function createApp() {
  const app = new Hono()
  setMiddlewares(app)
  setErrorHandling(app)

  // ルーティングの設定をする関数を呼ぶ
  // 動作確認用API
  app.get('/api/health', (c) => {
    return c.json({ status: 'ok' })
  })

  app.get('/api/details', (c) => {
    const now = new Date()
    return c.json({
      host: os.hostname(),
      time: now.toString(),
    })
  })

  return app
}

export default createApp
