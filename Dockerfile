FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN bun run build

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000

CMD ["bun", "run", "start"]
