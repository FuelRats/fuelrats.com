FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN if [ "$NODE_ENV" = "production" ]; then bun run build; fi

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs \
    && chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD if [ "$NODE_ENV" = "production" ]; then bun run start; else bun run next dev; fi
