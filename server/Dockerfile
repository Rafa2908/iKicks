# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY  . .

EXPOSE 8000

CMD [ "npm", "run", "start" ]
