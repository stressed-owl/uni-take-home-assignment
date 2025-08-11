# Ideally, it's better to create Dockerfiles for each microservice for both dev and prod environments, but for simplicity, let's create a universal prod.Dockerfile

FROM node:22-alpine

WORKDIR /app

RUN apk update && apk add --no-cache \
    curl \
    openssl

COPY package*.json ./
COPY apps/${APP_NAME}/prisma ./prisma/

RUN npm ci

COPY . .

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

CMD npm run start:dev ${APP_NAME}