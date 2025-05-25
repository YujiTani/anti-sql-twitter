import { secureHeaders } from 'hono/secure-headers'

const developmentSecureHeaders = secureHeaders({
  strictTransportSecurity: false,
  xFrameOptions: 'SAMEORIGIN',
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    connectSrc: ["'self'", 'ws://localhost:3000'],
    imgSrc: ["'self'", 'data:', 'blob:'],
  },
})

const productionSecureHeaders = secureHeaders({
  strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload',
  xFrameOptions: 'DENY',
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", 'https://fonts.googleapis.com'],
    connectSrc: ["'self'", 'https://api.yourapp.com'],
    imgSrc: ["'self'", 'https://cdn.yourapp.com'],
    upgradeInsecureRequests: [],
  },
})

// セキュアヘッダーを設定
export const secureHeadersMiddleware = () => {
  return process.env.NODE_ENV === 'production' ? productionSecureHeaders : developmentSecureHeaders
}
