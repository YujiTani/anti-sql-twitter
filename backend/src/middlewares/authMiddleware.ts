import { Context, Next } from 'hono'
import { jwt, sign } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { unauthorizedError } from './setErrorHandling'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthPayload {
  id: number
  email: string
  username: string
  role: 'user' | 'admin'
  iat: number
  exp: number
  iss: string
}
