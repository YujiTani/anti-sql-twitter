import { createMiddleware } from "hono/factory";
import {nanoid} from 'nanoid'

// リクエスト時のログを出力
function requestLoggerMiddleware() {
    return createMiddleware(async (c, next) => {
        const requestId = c.get('requestId') || nanoid();
        const requestTimeStamp = new Date().toISOString()

        c.set('requestTime', requestTimeStamp);
        c.set('requestId', requestId);
        // リクエスト情報をログに出力
        console.log(`
            ${requestTimeStamp} 
            [${requestId}] →
            ${c.req.method} 
            ${c.req.url}
        `);

        await next();
        // レスポンス情報をログに出力
        const duration = Date.now() - new Date(requestTimeStamp).getTime();
        console.log(`
            ${requestTimeStamp} 
            [${requestId}] ←
            ${c.req.method} 
            ${c.req.url}
            ${c.res.status} 
            ${duration}ms
        `);
    })
}

export default requestLoggerMiddleware;
