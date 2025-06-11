# === ビルドステージ ===
FROM oven/bun:alpine AS builder

WORKDIR /app

# 依存関係のインストール
COPY package.json bun.lock ./
RUN bun install

# TypeScript設定とソースコードをコピー
COPY tsconfig.json vite.config.ts tailwind.config.ts ./
COPY index.html ./
COPY src/ ./src/

# 本番用ビルド（一時的にTypeScriptチェック無効）
RUN bun run --bun vite build

# === 本番ステージ ===
FROM nginx:alpine AS production

# ビルド成果物をnginxのドキュメントルートにコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# ポート公開
EXPOSE 80

# nginxを起動
CMD ["nginx", "-g", "daemon off;"]