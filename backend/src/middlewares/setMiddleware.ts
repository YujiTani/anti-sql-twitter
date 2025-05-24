import { corsMiddleware } from "./corsMiddleware";
import requestLoggerMiddleware from "./requestLoggerMiddleware";
import { secureHeadersMiddleware } from "./secureHeadersMiddleware";

const middlewares = [
  {path: '/*' , func: corsMiddleware},
  {path: '/*', func: secureHeadersMiddleware},
  {path: '/*', func: requestLoggerMiddleware},
]

// ミドルウェアを設定する
export const setMiddlewares = (app: any) => {
  middlewares.forEach(({ path, func }) => {
    app.use(path, func)
  })
}
