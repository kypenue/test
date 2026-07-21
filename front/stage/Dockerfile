FROM node:20.15-alpine3.20 AS base

FROM base AS deps
ENV APP_URL="stage.cuply.pro"
ENV NEXT_PUBLIC_APP_URL="https://stage.cuply.pro"
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json .
RUN npm ci

FROM base AS builder
ENV APP_URL="stage.cuply.pro"
ENV NEXT_PUBLIC_APP_URL="https://stage.cuply.pro"
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV APP_URL="stage.cuply.pro"
ENV NEXT_PUBLIC_APP_URL="https://stage.cuply.pro"
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]