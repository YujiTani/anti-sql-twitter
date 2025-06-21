import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/api/useAuth'

export default function MyPage() {
  const { user, logout, isLogoutLoading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">認証が必要です</h1>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            ログインする
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">マイページ</h1>
            <button
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogoutLoading ? 'ログアウト中...' : 'ログアウト'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">プロフィール情報</h3>

              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">ユーザーID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">ユーザー名</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.username}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">登録日時</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleString('ja-JP')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* 仮想ユーザー情報 */}
          {user.virtual_users && user.virtual_users.length > 0 && (
            <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">仮想ユーザー</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {user.virtual_users.map((virtualUser) => (
                    <div key={virtualUser.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{virtualUser.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">性格: {virtualUser.personality}</p>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                        <div>
                          <span className="block font-medium">ツイート</span>
                          <span>{virtualUser.totalTweets}</span>
                        </div>
                        <div>
                          <span className="block font-medium">フォロワー</span>
                          <span>{virtualUser.totalFollowers}</span>
                        </div>
                        <div>
                          <span className="block font-medium">フォロー中</span>
                          <span>{virtualUser.totalFollowing}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ナビゲーションリンク */}
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">ナビゲーション</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={() => navigate('/')}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <h4 className="font-medium text-gray-900">ホーム</h4>
                  <p className="text-sm text-gray-600">メインページに戻る</p>
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <h4 className="font-medium text-gray-900">タイムライン</h4>
                  <p className="text-sm text-gray-600">ツイートを見る</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
