FROM node:16-alpine

WORKDIR /app

RUN apk add --no-cache musl-locales musl-locales-lang

ENV LANG=pt_BR.UTF-8
ENV LANGUAGE=pt_BR.UTF-8
ENV LC_ALL=pt_BR.UTF-8

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm install -g typescript

RUN tsc


EXPOSE 80

CMD ["node", "dist/index.js"]
