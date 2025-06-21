# データベース設計書

## プロジェクト概要

SQLパフォーマンスチューニング練習用のSNSアプリケーション「Anti SQL Twitter」のデータベース設計。  
意図的に非効率なSQL処理を組み込み、学習者がパフォーマンス改善を体験できる構成。

## ヒアリング結果

### 仮想ユーザー設計

#### 性格タイプ（4タイプ）

- **エンゲージャー**: リプライ・いいね多用、積極的交流、炎上しがち
- **インフォーマー**: 情報シェア中心、リツイート多め、冷静
- **ルーカー**: 閲覧中心、たまにいいね、ツイート少なめ
- **クリエイター**: オリジナルコンテンツ中心、フォロワー意識、定期投稿

#### 趣味カテゴリ（10種）

- テクノロジー
- アニメ・漫画
- スポーツ
- 料理・グルメ
- 音楽
- ゲーム
- 旅行
- ファッション
- 政治・社会
- エンタメ・芸能

#### 活動時間帯（4パターン）

- **朝型**: 6:00-12:00
- **昼型**: 10:00-18:00
- **夕方型**: 16:00-24:00
- **夜型**: 20:00-02:00

### アプリケーション仕様

#### 基本機能

- **文字制限**: 300文字
- **画像添付**: なし（仮想ユーザーは扱えない）
- **ハッシュタグ**: なし（初期バージョン）

#### ニュース連携

- 週1回のニュース取得
- 1時間ごとにUI表示
- 仮想ユーザーの確認・反応は性格ベースのランダム判定

#### ソーシャル機能

- **フォロー解除**: 苦手話題ツイート時 + 0.1%ランダム解除
- **フォロー履歴**: 完全記録
- **リプライ**: ツリー構造（返信の返信）
- **リツイート**: コメント追加可能
- **集計機能**: 管理者向けいいね数・リツイート数表示

#### パフォーマンス要件

- **ユーザー規模**: 月5万件データ増加
- **体感目標**: 重い画面で5秒表示
- **データ量**: 20万件から性能差体感

## テーブル設計

### 管理者ユーザーテーブル

```sql
-- 実際のアプリ利用者（仮想ユーザーの作成者）
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- インデックス意図的に不足（学習用）
```

### 仮想ユーザーテーブル

```sql
-- SNSで活動する仮想ユーザー
CREATE TABLE virtual_users (
    id SERIAL PRIMARY KEY,
    admin_user_id INTEGER REFERENCES admin_users(id),
    name VARCHAR(50) NOT NULL,
    personality VARCHAR(20) NOT NULL, -- 'engager', 'informer', 'lurker', 'creator'
    gender VARCHAR(10) NOT NULL,
    hobbies TEXT NOT NULL, -- JSON配列として格納（正規化なし：意図的）
    active_time VARCHAR(20) NOT NULL, -- 'morning', 'day', 'evening', 'night'
    active_level INTEGER DEFAULT 5, -- 1-10の積極性レベル
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 非正規化データ（意図的）
    admin_username VARCHAR(50), -- admin_users.usernameの重複
    total_tweets INTEGER DEFAULT 0,
    total_followers INTEGER DEFAULT 0,
    total_following INTEGER DEFAULT 0
);
-- インデックス不足で検索が遅い（学習用）
```

### ツイートテーブル

```sql
-- 意図的に非正規化した重複データを含む
CREATE TABLE tweets (
    id SERIAL PRIMARY KEY,
    virtual_user_id INTEGER REFERENCES virtual_users(id),
    content TEXT NOT NULL CHECK (length(content) <= 300),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 非正規化データ（パフォーマンス問題誘発）
    user_name VARCHAR(50) NOT NULL,
    user_personality VARCHAR(20) NOT NULL,
    user_active_time VARCHAR(20) NOT NULL,
    
    -- ニュース反応関連
    news_id INTEGER, -- ニュースへの反応の場合
    is_news_reaction BOOLEAN DEFAULT FALSE,
    
    -- リツイート関連
    original_tweet_id INTEGER REFERENCES tweets(id), -- リツイート元
    retweet_comment TEXT, -- リツイート時のコメント
    is_retweet BOOLEAN DEFAULT FALSE
);
-- インデックスなし：全ての検索でフルスキャン（学習用）
```

### フォロー関係テーブル

```sql
-- フォロー・フォロワー関係（履歴込み）
CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES virtual_users(id),
    following_id INTEGER REFERENCES virtual_users(id),
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unfollowed_at TIMESTAMP, -- NULL = 現在フォロー中
    
    -- 非正規化データ（N+1問題誘発用）
    follower_name VARCHAR(50),
    following_name VARCHAR(50),
    follower_personality VARCHAR(20),
    following_personality VARCHAR(20)
);
-- 適切な複合インデックスなし（学習用）
```

### リアクションテーブル

```sql
-- いいね、リプライ（ツリー構造）
CREATE TABLE reactions (
    id SERIAL PRIMARY KEY,
    virtual_user_id INTEGER REFERENCES virtual_users(id),
    tweet_id INTEGER REFERENCES tweets(id),
    reaction_type VARCHAR(10) NOT NULL, -- 'like', 'reply'
    content TEXT, -- リプライの場合のみ
    parent_reaction_id INTEGER REFERENCES reactions(id), -- リプライツリー用
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 非正規化データ（重いJOIN回避のつもりが逆効果）
    tweet_content TEXT,
    tweet_user_name VARCHAR(50),
    reactor_name VARCHAR(50)
);
-- インデックス設計ミス（学習用）
```

### ニュースデータテーブル

```sql
-- 週1回取得するニュース情報
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    published_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 集計データの非正規化（更新コスト高）
    total_reactions INTEGER DEFAULT 0,
    total_tweets_generated INTEGER DEFAULT 0
);
```

### ニュース反応ログテーブル

```sql
-- 仮想ユーザーのニュース確認・反応ログ
CREATE TABLE news_reactions (
    id SERIAL PRIMARY KEY,
    virtual_user_id INTEGER REFERENCES virtual_users(id),
    news_id INTEGER REFERENCES news(id),
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    interested BOOLEAN DEFAULT FALSE,
    tweeted BOOLEAN DEFAULT FALSE,
    tweet_id INTEGER REFERENCES tweets(id),
    
    -- パフォーマンス分析用の重複データ
    user_personality VARCHAR(20),
    news_category VARCHAR(50),
    reaction_score INTEGER -- 興味度スコア
);
```

## 意図的なパフォーマンス問題

### 1. 正規化不足

**問題**: 重複データによるストレージ肥大化とデータ不整合リスク

- `tweets`テーブルのユーザー情報重複
- `follows`テーブルの名前情報重複
- `reactions`テーブルのツイート情報重複

**体感効果**: ストレージ使用量3-5倍増加、更新処理の複雑化

### 2. インデックス不足

**問題**: 検索処理でフルテーブルスキャン発生

```sql
-- 遅いクエリ例
SELECT * FROM tweets WHERE user_name = 'Alice'; -- インデックスなし
SELECT * FROM follows WHERE follower_id = 123; -- 複合インデックスなし
```

**体感効果**: 10万件で数秒、50万件で10秒以上

### 3. N+1クエリ問題

**問題**: ループ内でのクエリ実行

```javascript
// 悪い例：ユーザー一覧取得でN+1発生
const users = await getVirtualUsers(); // 1クエリ
for (const user of users) {
  const tweets = await getTweetsByUser(user.id); // N回クエリ
  user.latestTweet = tweets[0];
}
```

**体感効果**: 100ユーザーで100回以上のクエリ実行

### 4. 不適切なJOIN

**問題**: 結合条件の設計ミス

```sql
-- 結合条件忘れ（意図的バグ）
SELECT * FROM tweets t, virtual_users u; -- カルテシアン積

-- 不要なJOIN
SELECT t.*, u.*, f.*, r.* 
FROM tweets t 
JOIN virtual_users u ON t.virtual_user_id = u.id
JOIN follows f ON f.following_id = u.id  -- 不要な結合
JOIN reactions r ON r.tweet_id = t.id;   -- 不要な結合
```

### 5. 全カラム取得

**問題**: SELECT * による不要なデータ転送

```sql
-- 悪い例
SELECT * FROM tweets WHERE created_at > '2024-01-01'; -- 全カラム

-- 良い例
SELECT id, content, created_at FROM tweets WHERE created_at > '2024-01-01';
```

### 6. インデックス効かないWHERE句

**問題**: 関数やワイルドカードでインデックス無効化

```sql
-- インデックスが効かない例
SELECT * FROM virtual_users WHERE LOWER(name) = 'alice';
SELECT * FROM tweets WHERE content LIKE '%keyword%';
SELECT * FROM virtual_users WHERE created_at + INTERVAL '1 day' > NOW();
```

## API設計

### 認証関連

- `POST /api/auth/register` - 管理者ユーザー登録
- `POST /api/auth/login` - ログイン（JWT発行）
- `GET /api/auth/me` - 現在のユーザー情報取得

### 管理者ユーザー管理

- `GET /api/admin-users` - 管理者ユーザー一覧（N+1問題）
- `GET /api/admin-users/:id` - 管理者ユーザー詳細

### 仮想ユーザー管理

- `POST /api/virtual-users` - 仮想ユーザー作成（認証必須）
- `GET /api/virtual-users` - 自分の仮想ユーザー一覧
- `GET /api/virtual-users/:id` - 仮想ユーザー詳細

### ツイート関連（今後追加予定）

- `GET /api/tweets` - ツイート一覧（重いクエリ）
- `GET /api/users/:id/timeline` - タイムライン（最重要・最遅）

## SQL学習ポイント

### レベル1: 基本的な問題発見

- EXPLAIN文でクエリ実行計画の確認
- インデックス追加前後のパフォーマンス比較
- SELECT * を避ける効果の測定

### レベル2: 設計改善

- 正規化による重複データ解消
- 適切な複合インデックス設計
- 結合条件の最適化

### レベル3: 高度な最適化

- N+1問題の解決（バッチ取得、JOINの活用）
- パーティショニング
- クエリキャッシュの活用

## パフォーマンス改善案

### 即効性の高い改善

```sql
-- インデックス追加
CREATE INDEX idx_tweets_user_created ON tweets(virtual_user_id, created_at);
CREATE INDEX idx_follows_active ON follows(follower_id, following_id) WHERE unfollowed_at IS NULL;

-- クエリ最適化
SELECT id, content, created_at 
FROM tweets 
WHERE virtual_user_id = $1 
ORDER BY created_at DESC 
LIMIT 20;
```

### 設計レベルの改善

```sql
-- 正規化されたテーブル構造
CREATE TABLE tweet_metrics (
    tweet_id INTEGER PRIMARY KEY,
    likes_count INTEGER DEFAULT 0,
    retweets_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0
);
```

## 技術スタック

### データベース

- **PostgreSQL**: メインデータベース
- **Prisma**: ORM（Raw SQL重視）

### 認証

- **JWT**: ステートレス認証
- **bcrypt**: パスワードハッシュ化

### API

- **Hono**: 軽量Webフレームワーク
- **TypeScript**: 型安全性確保

## 実装フェーズ

### Phase 1: 基盤構築

1. PostgreSQL統合
2. Prisma設定
3. 基本テーブル作成

### Phase 2: 認証システム

1. JWT実装
2. 管理者ユーザーCRUD
3. 認証ミドルウェア

### Phase 3: 仮想ユーザー

1. 仮想ユーザーCRUD
2. 基本的なリレーション
3. サンプルデータ投入

### Phase 4: SNS機能

1. ツイート機能
2. フォロー機能
3. タイムライン表示

### Phase 5: パフォーマンス問題

1. 重いクエリの実装
2. モニタリング機能
3. 改善ガイド作成

このデータベース設計により、SQLパフォーマンスチューニングの実践的な学習環境を提供します。
