// Supabase関連は一時的に無効化（将来的にJWT認証に変更予定）
/*
import { User } from '@supabase/supabase-js'
import { atom, useAtom } from 'jotai'

export type UserStore = {
  user: User | null
  setUser: (user: User) => void
}

const userAtom = atom<User | null>(null)
const setUserAtom = atom(
  (get) => get(userAtom),
  (get, set, user: User) => {
    set(userAtom, user)
  }
)

export function useUserStore(): UserStore {
  const [user] = useAtom(userAtom)
  const [, setUser] = useAtom(setUserAtom)

  return {
    user,
    setUser,
  }
}
*/

// 一時的なダミーexport（TypeScriptエラー回避）
export const placeholder = 'user-store-disabled'
