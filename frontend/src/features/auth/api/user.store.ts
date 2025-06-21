import { atom } from 'jotai'

// ユーザー型定義
export interface User {
  id: number
  email: string
  username: string
  created_at: string
  virtual_users?: Array<{
    id: number
    name: string
    personality: string
    totalTweets: number
    totalFollowers: number
    totalFollowing: number
  }>
}

// 認証状態の管理
export const userAtom = atom<User | null>(null)
export const isAuthenticatedAtom = atom<boolean>((get) => get(userAtom) !== null)
export const isLoadingAtom = atom<boolean>(false)
