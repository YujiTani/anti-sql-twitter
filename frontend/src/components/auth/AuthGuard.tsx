import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/api/useAuth'

interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
}

export default function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo)
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo])

  // ローディング中は何も表示しない
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // 認証されていない場合は何も表示しない（リダイレクト中）
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
