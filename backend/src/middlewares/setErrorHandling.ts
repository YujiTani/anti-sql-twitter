import { Context, Hono } from 'hono'
import { nanoid } from 'nanoid'
import { ErrorStatusCode, HTTP_STATUS, getDefaultMessage } from '../types/errorTypes'

// エラーレスポンス共通処理
export const createErrorResponse = (
  c: Context,
  error: any,
  statusInfo:
    | ErrorStatusCode
    | { code: ErrorStatusCode; message: string } = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  customMessage?: string,
) => {
  // statusInfoがオブジェクトかどうかで分岐
  let statusCode: ErrorStatusCode
  let errorMessage: string

  if (typeof statusInfo === 'object') {
    statusCode = statusInfo.code
    errorMessage = statusInfo.message
  } else {
    statusCode = statusInfo
    errorMessage = customMessage || getDefaultMessage(statusCode)
  }
  const requestId = c.get('requestId') || nanoid()
  const requestTimeStamp = c.get('requestTime') || new Date().toISOString()

  // エラーログ出力
  console.warn(
    `[ERROR] ${requestTimeStamp} [${requestId}] Status: ${statusCode} ← ${error?.message || error}`,
  )

  return c.json(
    {
      error: errorMessage,
      message: error?.message || 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      requestId,
    },
    statusCode,
  )
}

// よく使われるエラーパターンのヘルパー関数
export const badRequestError = (c: Context, message: string) => {
  return createErrorResponse(c, { message }, HTTP_STATUS.BAD_REQUEST, `Bad Request: ${message}`)
}

export const unauthorizedError = (c: Context, message: string = 'Unauthorized') => {
  return createErrorResponse(c, { message }, HTTP_STATUS.UNAUTHORIZED, `Unauthorized: ${message}`)
}

export const forbiddenError = (c: Context, message: string = 'Forbidden') => {
  return createErrorResponse(c, { message }, HTTP_STATUS.FORBIDDEN, `Forbidden: ${message}`)
}

export const notFoundError = (c: Context, message: string = 'Not Found') => {
  return createErrorResponse(c, { message }, HTTP_STATUS.NOT_FOUND, `Not Found: ${message}`)
}

export const conflictError = (c: Context, message: string) => {
  return createErrorResponse(c, { message }, HTTP_STATUS.CONFLICT, `Conflict: ${message}`)
}

export const internalServerError = (c: Context, error: any) => {
  return createErrorResponse(c, error, HTTP_STATUS.INTERNAL_SERVER_ERROR)
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
