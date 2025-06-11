import { serve } from '@hono/node-server'
import createApp from './app.js'

// appを作成し、サーバーを起動する
function main() {
  const app = createApp()
  const port = process.env.PORT || 80

  serve(
    {
      fetch: app.fetch,
      port: Number(port),
    },
    (info) => {
      console.log(`Listening on http://localhost:${info.port}`)
    },
  )
}

// 直接実行された場合のみサーバーを起動
if (import.meta.main) {
  main()
}

export default main
