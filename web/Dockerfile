FROM node:22-alpine@sha256:cb3143549582cc5f74f26f0992cdef4a422b22128cb517f94173a5f910fa4ee7 AS base


FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# fix corepack https://github.com/nodejs/corepack/issues/612
RUN npm i -g corepack@latest && corepack enable

ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG NEXT_PUBLIC_API_URL_DEV
ENV NEXT_PUBLIC_API_URL_DEV=$NEXT_PUBLIC_API_URL_DEV
ARG NEXT_PUBLIC_API_URL_PROD
ENV NEXT_PUBLIC_API_URL_PROD=$NEXT_PUBLIC_API_URL_PROD
ARG NEXT_PUBLIC_FARO_URL_DEV
ENV NEXT_PUBLIC_FARO_URL_DEV=$NEXT_PUBLIC_FARO_URL_DEV
ARG NEXT_PUBLIC_FARO_URL_PROD
ENV NEXT_PUBLIC_FARO_URL_PROD=$NEXT_PUBLIC_FARO_URL_PROD
ARG NEXT_PUBLIC_SERVICE_NAME
ENV NEXT_PUBLIC_SERVICE_NAME=$NEXT_PUBLIC_SERVICE_NAME

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY web/package.json ./web/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY web ./web
RUN pnpm --filter web build


# Production image, copy all the files and run next
FROM base AS runner

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

WORKDIR /app

# Set the correct permission for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/standalone .
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/static ./web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/web/public ./web/public
WORKDIR /app/web

RUN apk add --no-cache curl

USER nextjs

EXPOSE 3000
ENV PORT=3000
HEALTHCHECK CMD ["curl", "--fail", "http://localhost:3000/api/health", "||", "exit", "1"]

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
