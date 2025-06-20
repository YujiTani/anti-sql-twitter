# frontend/CLAUDE.md

このファイルは、フロントエンド開発における専用ガイダンスを提供します。

**📁 階層ルール**: プロジェクト全体の共通ルールは `/CLAUDE.md` を参照してください。

## 🎨 フロントエンド技術スタック

### 核となる技術
- **React 18**: コンポーネントベース開発
- **TypeScript**: 型安全性の確保
- **Vite**: 高速開発サーバー・ビルドツール
- **Tailwind CSS**: ユーティリティファーストCSS

### 状態管理
- **Jotai**: アトミックな状態管理（ローカル状態）
- **TanStack Query**: サーバー状態・キャッシュ管理
- **React Router**: ルーティング

## 🏗️ アーキテクチャ・ディレクトリ構成

### ディレクトリ構造
```
src/
├── api/                 # API通信クライアント
│   └── api-client.ts   # 一元化APIクライアント
├── app/                # アプリケーション設定
│   ├── App.tsx         # メインアプリコンポーネント
│   └── router.tsx      # ルーティング設定
├── components/         # 共通コンポーネント
│   ├── errors/         # エラー表示コンポーネント
│   ├── layouts/        # レイアウトコンポーネント
│   ├── seo/           # SEO関連コンポーネント
│   └── ui/            # 再利用可能UIコンポーネント
├── features/          # 機能別コンポーネント群
│   ├── auth/          # 認証機能
│   └── decarbonisation/ # 脱炭素機能（例）
├── hooks/             # カスタムフック
├── pages/             # ページコンポーネント
└── assets/            # 静的アセット
```

### 設計原則
- **機能別ディレクトリ**: `/features/` 配下で機能をカプセル化
- **共通コンポーネント**: `/components/ui/` で再利用可能コンポーネント
- **カスタムフック**: ロジックの分離と再利用性

## 🔧 開発ルール・規約

### TypeScript規約

#### インポート拡張子ルール
```typescript
// ✅ 正しい（拡張子なし）
import { Component } from './Component'
import { useAuth } from '../hooks/useAuth'

// ❌ 間違い
import { Component } from './Component.tsx'
import { useAuth } from '../hooks/useAuth.ts'
```

#### 型定義の場所
- **コンポーネント用型**: 同じファイル内で定義
- **共通型**: `/types/` ディレクトリで管理
- **API型**: バックエンドと同期

### コンポーネント設計規約

#### 命名規則
```typescript
// ✅ 正しいコンポーネント命名
export default function UserProfile() { }
export function LoginButton() { }

// ✅ 正しいファイル命名
UserProfile.tsx
LoginButton.tsx
useUserProfile.ts
```

#### props型定義
```typescript
// ✅ 正しいprops定義
interface UserProfileProps {
  userId: string
  className?: string
  onEdit?: () => void
}

export default function UserProfile({ userId, className, onEdit }: UserProfileProps) {
  // ...
}
```

### 状態管理規約

#### Jotai使用パターン
```typescript
// ✅ アトム定義
import { atom } from 'jotai'

export const userAtom = atom<User | null>(null)
export const isLoadingAtom = atom(false)

// ✅ 派生アトム
export const userNameAtom = atom((get) => {
  const user = get(userAtom)
  return user?.name ?? '未ログイン'
})
```

#### TanStack Query使用パターン
```typescript
// ✅ API取得フック
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiClient.getUser(userId),
    enabled: !!userId
  })
}

// ✅ 更新フック
export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiClient.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })
}
```

### CSS・スタイリング規約

#### Tailwind CSS使用方針
```tsx
// ✅ レスポンシブ対応
<div className="flex flex-col md:flex-row gap-4 p-4">

// ✅ ダークモード対応
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// ✅ カスタムスタイルが必要な場合
<div className="custom-gradient" style={{ /* 複雑なスタイル */ }}>
```

#### コンポーネント共通スタイル
```typescript
// ✅ スタイル用のユーティリティ関数
export const buttonStyles = {
  base: "px-4 py-2 rounded font-medium transition-colors",
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900"
}
```

## 🚀 開発コマンド

### 日常開発コマンド
```bash
# 開発サーバー起動
bun run dev

# 型チェック
bun run check-types

# 本番ビルド
bun run build

# ビルド結果のプレビュー
bun run start
```

### デバッグ・テスト
```bash
# テスト実行
bun run test

# テスト（ウォッチモード）
bun run test:watch

# カバレッジ確認
bun run test:coverage
```

## 📱 UI/UX ガイドライン

### レスポンシブ対応
- **モバイルファースト**: 最小画面から設計
- **ブレークポイント**: Tailwindのデフォルト（sm, md, lg, xl, 2xl）
- **タッチ対応**: ボタンサイズ44px以上

### アクセシビリティ
```tsx
// ✅ 適切なaria属性
<button 
  aria-label="ユーザープロフィールを編集"
  onClick={handleEdit}
>
  <EditIcon />
</button>

// ✅ セマンティックHTML
<main>
  <h1>ページタイトル</h1>
  <section>
    <h2>セクションタイトル</h2>
  </section>
</main>
```

### パフォーマンス最適化
- **React.memo**: 不要な再レンダリング防止
- **useMemo/useCallback**: 計算結果・関数のメモ化
- **Code Splitting**: 機能別の遅延読み込み

## 🔗 API通信

### API Client使用
```typescript
// ✅ 一元化APIクライアント使用
import { apiClient } from '@/api/api-client'

// GET
const user = await apiClient.getUser(userId)

// POST
const newUser = await apiClient.createUser(userData)

// 認証ヘッダー自動付与済み
```

### エラーハンドリング
```typescript
// ✅ TanStack Queryでのエラーハンドリング
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiClient.getUser(userId),
    retry: 2,
    onError: (error) => {
      console.error('ユーザー取得エラー:', error)
      // 通知システムでエラー表示
    }
  })
}
```

## 🧪 テスト規約

### テストファイル配置
```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx      # 同じディレクトリに配置
├── hooks/
│   ├── useAuth.ts
│   └── useAuth.test.ts
```

### テスト記述パターン
```typescript
// ✅ コンポーネントテスト
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  test('正しいテキストを表示する', () => {
    render(<Button>テストボタン</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('テストボタン')
  })
})
```

---

## 📝 フロントエンド専用ルール追加履歴
<!-- フロントエンド固有の標準ルールはここに自動追加されます -->