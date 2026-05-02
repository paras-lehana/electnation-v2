FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy workspace config and package.json files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/functions/package.json ./apps/functions/
COPY packages/core/package.json ./packages/core/

RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN corepack enable pnpm
COPY . .
RUN pnpm install --frozen-lockfile

# Build the project
RUN pnpm --filter @yatra/core build
RUN pnpm --filter @yatra/functions build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

RUN corepack enable pnpm

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/functions/package.json ./apps/functions/
COPY --from=builder /app/packages/core/package.json ./packages/core/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder --chown=expressjs:nodejs /app/apps/functions/dist ./apps/functions/dist
COPY --from=builder --chown=expressjs:nodejs /app/packages/core/dist ./packages/core/dist

USER expressjs

EXPOSE 8080

ENV PORT 8080

CMD ["node", "apps/functions/dist/server.js"]
