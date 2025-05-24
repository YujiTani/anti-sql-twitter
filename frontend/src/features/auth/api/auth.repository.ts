import supabase from '@/utils/supabase';

// セッションを取得する関数
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

// ユーザー情報を取得
export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw Error('not found user');
  }

  return user;
}

// サインアウト処理を行う関数
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
