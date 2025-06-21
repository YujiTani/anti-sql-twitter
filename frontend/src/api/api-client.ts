import axios from 'axios'

// トークン管理クラス
class TokenManager {
  private accessToken: string | null = null

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  clearTokens() {
    this.accessToken = null
  }
}

const tokenManager = new TokenManager()

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  withCredentials: true, // Cookieを送信するために必要
})

// リクエストインターセプター（JWT認証ヘッダー追加）
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenManager.getAccessToken()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// レスポンスインターセプター（トークン自動更新）
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // 401エラーかつリトライしていない場合
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // リフレッシュトークンでアクセストークンを更新（Cookieは自動送信）
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/refresh`,
          {},
          { withCredentials: true },
        )

        const newAccessToken = response.data.accessToken
        tokenManager.setAccessToken(newAccessToken)

        // 元のリクエストを再実行
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axios(originalRequest)
      } catch (refreshError) {
        console.error('トークン更新失敗:', refreshError)
        tokenManager.clearTokens()
        // ログインページにリダイレクト
        window.location.href = '/login'
      }
    }

    console.error('Response error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  },
)

// 認証API
export const authAPI = {
  // ユーザー登録
  register: (data: { email: string; username: string; password: string }) =>
    apiClient.post('/api/auth/register', data),

  // ログイン
  login: (data: { email: string; password: string }) => apiClient.post('/api/auth/login', data),

  // 現在のユーザー情報取得
  me: () => apiClient.get('/api/auth/me'),

  // ログアウト
  logout: async () => {
    await apiClient.post('/api/auth/logout')
    tokenManager.clearTokens()
  },

  // アクセストークン設定
  setAccessToken: (accessToken: string) => {
    tokenManager.setAccessToken(accessToken)
  },

  // アクセストークン取得
  getAccessToken: () => tokenManager.getAccessToken(),
}

export default apiClient
