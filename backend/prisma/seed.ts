import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('開発用データのシード開始...')

  // 開発用デフォルトユーザーの作成
  const defaultUser = await prisma.adminUser.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      passwordHash: await Bun.password.hash('password123'),
    },
  })

  console.log('✅ デフォルトユーザーを作成しました:', {
    id: defaultUser.id,
    email: defaultUser.email,
    username: defaultUser.username,
  })

  // テスト用の仮想ユーザーを作成
  const virtualUsers = await Promise.all([
    prisma.virtualUser.upsert({
      where: { id: 1 },
      update: {},
      create: {
        adminUserId: defaultUser.id,
        name: 'エンゲージャー太郎',
        personality: 'engager',
        gender: 'male',
        hobbies: '["SNS", "コミュニケーション", "ネットワーキング"]',
        activeTime: 'day',
        activeLevel: 8,
        adminUsername: defaultUser.username,
        totalTweets: 0,
        totalFollowers: 0,
        totalFollowing: 0,
      },
    }),
    prisma.virtualUser.upsert({
      where: { id: 2 },
      update: {},
      create: {
        adminUserId: defaultUser.id,
        name: 'インフォーマー花子',
        personality: 'informer',
        gender: 'female',
        hobbies: '["読書", "ニュース", "情報収集"]',
        activeTime: 'morning',
        activeLevel: 6,
        adminUsername: defaultUser.username,
        totalTweets: 0,
        totalFollowers: 0,
        totalFollowing: 0,
      },
    }),
  ])

  console.log('✅ 仮想ユーザーを作成しました:', virtualUsers.length, '件')

  console.log('🎉 シード処理が完了しました！')
  console.log('')
  console.log('📝 デフォルトユーザー情報:')
  console.log('  Email: admin@example.com')
  console.log('  Password: password123')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ シード処理中にエラーが発生しました:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
