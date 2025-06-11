# === ビルドステージ ===
FROM oven/bun:alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY tsconfig.json ./
COPY ./src/ ./src/

RUN bun run build

# === 本番ステージ ===
FROM oven/bun:alpine AS production

WORKDIR /app

COPY package.json ./

# 本番依存関係のみインストール
RUN bun install --production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["bun", "start"]
