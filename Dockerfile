# This entire file is borrowed from https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# NOTE: I have updated to lts-alpine and added the sed command to uncomment output: "standalone" in next.config.js

FROM node:22.9.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Uncomment output: "standalone" in next.config.js
RUN sed -i 's|// output: "standalone",|output: "standalone",|' next.config.js

# Opt out of telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Install dependencies needed for DB scripts
RUN npm install postgres@3.4.4 drizzle-orm@0.33.0 drizzle-kit@0.22.8 zod@3.23.8

# Copy Drizzle config
COPY drizzle.config.ts ./ 

# Copy the DB scripts + schema
COPY ./db ./db

ENV NODE_ENV=production
# Opt out of runtime telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]