# Multi-stage build for optimized production image
FROM node:22-alpine AS deps
# Install dependencies needed for node-gyp
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies
RUN yarn install --immutable

# Rebuild stage for Next.js
FROM node:22-alpine AS builder
WORKDIR /app

# Accept build-time argument for NODE_ENV (must be explicitly set)
ARG NODE_ENV

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn

# Copy application source
COPY . .

# Build the Next.js application with the specified NODE_ENV
ENV NODE_ENV=${NODE_ENV}
RUN yarn build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy everything from builder and set ownership
COPY --from=builder --chown=nextjs:nodejs /app ./

USER nextjs

# Expose port
EXPOSE 3000

# Start the application using yarn start
CMD ["yarn", "start"]