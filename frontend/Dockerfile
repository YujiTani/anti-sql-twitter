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
COPY public/ ./public/

# 本番用ビルド
RUN bun run build

# === 本番ステージ ===
FROM nginx:alpine AS production

# ビルド成果物をnginxのドキュメントルートにコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# カスタムnginx設定（SPA用）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ポート公開
EXPOSE 80

# nginxを起動
CMD ["nginx", "-g", "daemon off;"]