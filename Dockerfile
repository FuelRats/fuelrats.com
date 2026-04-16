# Multi-stage build with explicit dev / prod targets.
#
# Build the dev image:   docker compose -f docker-compose.yml -f docker-compose.dev.yml build
# Build the prod image:  docker compose build
#
# The dev image never bakes in a compiled `dist/` so there's no stale
# production cache for `next dev` to pick up. The prod image runs
# `next build` once at image build time and then `next start` at runtime.

# ---------- base ----------
# Shared setup: install dependencies and copy the full source tree.
FROM oven/bun:latest AS base
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000


# ---------- dev ----------
# No build step, no extra user. `next dev` writes its own caches at runtime.
# In docker-compose.dev.yml, the host's `src/` is mounted over /app/src for HMR.
FROM base AS dev
ENV NODE_ENV=development
CMD ["bun", "run", "next", "dev"]


# ---------- prod ----------
# Compiles the production bundle into ./dist and runs as an unprivileged user.
FROM base AS prod
ENV NODE_ENV=production
RUN bun run build
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs \
    && chown -R nextjs:nodejs /app
USER nextjs
CMD ["bun", "run", "start"]
