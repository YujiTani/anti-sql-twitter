import { useSuspenseQuery } from '@tanstack/react-query';
import { getSession, getUser } from './auth.repository';
import { useUserStore } from './user.store';

/**
 * セッション情報を取得
 * @returns セッション
 */
export function useAuth() {
  const sessionQuery = useSuspenseQuery({
    queryFn: getSession,
    queryKey: ['auth', 'session'],
  });

  return {
    session: sessionQuery.data,
  };
}

/**
 * ログイン中のユーザー情報のみを取得
 * @returns ユーザー
 */
export function useUser() {
  const { setUser } = useUserStore();
  const {data} = useSuspenseQuery({
    queryFn: getUser,
    queryKey: ['user'],
  });

  setUser(data);
  return {
    user: data
  }
}
