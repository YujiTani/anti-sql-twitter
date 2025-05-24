import { useUser } from '@/features/auth/api/useAuth';

/**
 * header; ユーザー情報を表示
 */
function User() {
  const { user } = useUser();
  return <>{user && <p>{user.user_metadata.name}</p>}</>;
}

export default User;
