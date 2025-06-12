// HTTPエラーステータスコードの型定義

/**
 * HTTPステータスコード定数
 */
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

/**
 * アプリケーションで使用するエラーステータスコード型
 */
export type ErrorStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]

/**
 * エラーレスポンスの基本構造
 */
export interface ErrorResponse {
  error: string
  message: string
  stack?: string
  requestId: string
}

/**
 * デフォルトエラーメッセージの取得
 */
export function getDefaultMessage(statusCode: ErrorStatusCode): string {
  switch (statusCode) {
    case HTTP_STATUS.BAD_REQUEST:
      return 'Bad Request'
    case HTTP_STATUS.UNAUTHORIZED:
      return 'Unauthorized'
    case HTTP_STATUS.FORBIDDEN:
      return 'Forbidden'
    case HTTP_STATUS.NOT_FOUND:
      return 'Not Found'
    case HTTP_STATUS.CONFLICT:
      return 'Conflict'
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return 'Internal Server Error'
    default:
      return 'Error'
  }
}
