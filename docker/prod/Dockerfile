FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

USER node

FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

COPY --from=development /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "dist/main"]