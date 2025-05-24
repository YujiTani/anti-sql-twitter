import { User } from '@supabase/supabase-js';
import { atom, useAtom } from 'jotai';

export type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
};

const userAtom = atom<User | null>(null);
const setUserAtom = atom(null, (_, set, user: User) => {
  set(userAtom, user);
});

export function useUserStore(): UserStore {
  const [user] = useAtom(userAtom);
  const [, setUser] = useAtom(setUserAtom);

  return {
    user,
    setUser,
  };
}
