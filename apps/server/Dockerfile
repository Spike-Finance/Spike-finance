# Stage 1: Base image
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@12.4.2 --activate

# Stage 2: Dependencies
FROM base AS dependencies
WORKDIR /app

# Copy root configs and lockfile
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
# Copy workspace package manifests
COPY apps/server/package.json ./apps/server/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies across the monorepo
RUN pnpm install --frozen-lockfile

# Stage 3: Builder
FROM dependencies AS builder
WORKDIR /app

# Build-time placeholder so Prisma generate does not fail on missing DB connection
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

# Copy source code
COPY apps/server ./apps/server
COPY packages/database ./packages/database
COPY packages/shared ./packages/shared

# Generate Prisma Client & compile workspaces
RUN pnpm --filter @spike/database generate
RUN pnpm --filter @spike/shared build
RUN pnpm --filter server build

# Stage 4: Production Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy runtime node_modules and built packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json

USER nestjs
EXPOSE 8000

CMD ["node", "apps/server/dist/main.js"]
