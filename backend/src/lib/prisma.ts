import { PrismaClient } from '@prisma/client'

// PrismaClientのシングルトンインスタンス
let prisma: PrismaClient

declare global {
  var __prisma: PrismaClient | undefined
}

// 開発環境では複数回初期化を避けるためにglobal変数を使用
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient()
  }
  prisma = global.__prisma
}

export { prisma }
