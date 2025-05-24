import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import supabase from '@/utils/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/useAuth';
import { useEffect } from 'react';

function Login() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/home');
    }
  }, [session, navigate]);

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={['google']}
    />
  );
}

export default Login;
