import { Context, Hono } from 'hono'
import { nanoid } from 'nanoid'

// エラーレスポンス共通処理
export const createErrorResponse = (
  c: Context,
  error: any,
  statusCode: number = 500,
  customMessage?: string,
) => {
  const requestId = c.get('requestId') || nanoid()
  const requestTimeStamp = c.get('requestTime') || new Date().toISOString()

  // エラーログ出力
  console.warn(
    `[ERROR] ${requestTimeStamp} [${requestId}] Status: ${statusCode} ← ${error?.message || error}`,
  )

  return c.json(
    {
      error: customMessage || (statusCode === 500 ? 'Internal Server Error' : 'Error'),
      message: error?.message || 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      requestId,
    },
    statusCode,
  )
}

// よく使われるエラーパターンのヘルパー関数
export const badRequestError = (c: Context, message: string) => {
  return createErrorResponse(c, { message }, 400, 'Bad Request')
}

export const unauthorizedError = (c: Context, message: string = 'Unauthorized') => {
  return createErrorResponse(c, { message }, 401, 'Unauthorized')
}

export const forbiddenError = (c: Context, message: string = 'Forbidden') => {
  return createErrorResponse(c, { message }, 403, 'Forbidden')
}

export const notFoundError = (c: Context, message: string = 'Not Found') => {
  return createErrorResponse(c, { message }, 404, 'Not Found')
}

export const conflictError = (c: Context, message: string) => {
  return createErrorResponse(c, { message }, 409, 'Conflict')
}

export const internalServerError = (c: Context, error: any) => {
  return createErrorResponse(c, error, 500)
}

// グローバルエラーハンドリング設定
const setErrorHandling = (app: Hono) => {
  // グローバルエラーハンドラー
  app.onError((err, c: Context) => {
    return internalServerError(c, err)
  })

  // 404ハンドラー
  app.notFound((c: Context) => {
    const requestId = c.get('requestId') || nanoid()
    const requestTimeStamp = c.get('requestTime') || new Date().toISOString()
    console.log(`[NOT FOUND] ${requestTimeStamp} [${requestId}] ← ${c.req.method} ${c.req.url}`)
    return c.json(
      {
        error: 'Not Found',
        requestId,
      },
      404,
    )
  })
}

export default setErrorHandling
