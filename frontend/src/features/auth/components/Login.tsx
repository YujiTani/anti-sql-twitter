import supabase from '@/utils/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../api/useAuth'

function Login() {
  const { session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (session) {
      navigate('/home')
    }
  }, [session, navigate])

  return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} />
}

export default Login
