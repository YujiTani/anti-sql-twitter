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

COPY package.json bun.lock ./

# バージョン固定、本番依存関係のみ、詳細ログ
RUN bun install --frozen-lockfile --production --verbose

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["bun", "start"]
