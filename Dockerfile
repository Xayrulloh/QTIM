FROM node:22-alpine
WORKDIR /app
COPY dist src
COPY package*.json .
COPY .env .
RUN corepack enable
RUN pnpm i --prod
ENTRYPOINT ["node", "src/main"]
