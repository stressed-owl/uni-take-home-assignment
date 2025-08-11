# Ideally, it's better to create Dockerfiles for each microservice for both dev and prod environments, but for simplicity, let's create a universal prod.Dockerfile

FROM node:22-alpine AS base

WORKDIR /app

RUN apk update && apk add --no-cache \
    curl \
    openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

FROM base AS builder

COPY . .

ARG APP_NAME

RUN npm run build ${APP_NAME}

FROM base as production-deps

RUN npm prune --production

FROM node:22-alpine AS final

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

USER nestjs

COPY --chown=nestjs:nodejs --from=production-deps /app/node_modules ./node_modules
COPY --chown=nestjs:nodejs --from=builder /app/dist ./dist

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

CMD ["node", "dist/apps/${APP_NAME}/main"]