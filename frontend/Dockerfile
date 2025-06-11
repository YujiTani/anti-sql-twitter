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
FROM oven/bun:alpine AS production

WORKDIR /app

# 本番依存関係のインストール（将来のSSR対応）
COPY package.json ./
RUN bun install --production

# ビルド成果物をコピー
COPY --from=builder /app/dist ./dist

# 将来のSSR対応のため、package.jsonとソースも保持
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src

EXPOSE 80

# 現在: 静的ファイル配信（bunx serveを使用）
# 将来: SSRサーバーに変更可能
RUN bun add -g serve
CMD ["serve", "-s", "dist", "-l", "80"]