import { serve } from '@hono/node-server'
import createApp from './app';

// appを作成し、サーバーを起動する
function main() {
  const app = createApp();
  const port = process.env.PORT || 3000;

  serve({
    fetch: app.fetch,
    port: Number(port),
  }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`)
  });
}

// 直接実行された場合のみサーバーを起動
if (require.main === module) {
  main()
}

export default main;
