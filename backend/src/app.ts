import { Hono } from "hono";
import { setMiddlewares } from "./middlewares/setMiddleware";

// アプリケーションを設定し作成する
function createApp() {
    const app = new Hono();
    setMiddlewares(app);
    // エラーハンドリングの設定をする関数を呼ぶ
    
    // ルーティングの設定をする関数を呼ぶ
  // app.route('/api', apiRouter)

  return app
}
