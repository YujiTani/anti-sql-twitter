FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lock tsconfig.json ./

RUN bun install

COPY ./src/ ./src/

EXPOSE 3000

CMD ["bun", "src/main.ts"]
