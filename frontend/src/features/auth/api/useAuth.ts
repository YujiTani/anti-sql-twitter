import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { authAPI } from '@/api/api-client'
import { userAtom, isLoadingAtom, User } from './user.store'
import { useNotificationStore } from '@/components/ui/notifications/notification-store'

// 認証フック
export function useAuth() {
  const [user, setUser] = useAtom(userAtom)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const queryClient = useQueryClient()
  const { addNotification } = useNotificationStore()

  // ユーザー情報取得クエリ
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authAPI.me()
      return response.data.user as User
    },
    enabled: !!authAPI.getAccessToken(),
    retry: false,
    onSuccess: (data: User) => {
      setUser(data)
    },
    onError: () => {
      setUser(null)
      authAPI.logout()
    },
  })

  // ログイン
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      const { user, accessToken } = response.data
      authAPI.setAccessToken(accessToken)
      setUser(user)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      addNotification({
        type: 'success',
        message: 'ログインしました',
      })
    },
    onError: (error: any) => {
      console.error('ログインエラー:', error)
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'ログインに失敗しました',
      })
      throw new Error(error.response?.data?.message || 'ログインに失敗しました')
    },
  })

  // 登録
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      const { user, accessToken } = response.data
      authAPI.setAccessToken(accessToken)
      setUser(user)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      addNotification({
        type: 'success',
        message: 'ユーザー登録が完了しました',
      })
    },
    onError: (error: any) => {
      console.error('登録エラー:', error)
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'ユーザー登録に失敗しました',
      })
      throw new Error(error.response?.data?.message || 'ユーザー登録に失敗しました')
    },
  })

  // ログアウト
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      setUser(null)
      queryClient.clear()
      addNotification({
        type: 'success',
        message: 'ログアウトしました',
      })
    },
  })

  return {
    // 状態
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || isUserLoading,

    // アクション
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    // 状態
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  }
}
