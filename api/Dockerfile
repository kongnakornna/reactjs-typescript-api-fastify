FROM node:18.12.1-alpine

LABEL maintainer="kongnakorn jantakun <kongnakornjantakun@gmail.com>"

WORKDIR /home/api

RUN apk update && \
  apk upgrade && \
  apk add --no-cache \
  alpine-sdk git python \
  build-base libtool autoconf \
  automake gzip g++ \
  make tzdata \
  && cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime \
  && echo "Asia/Bangkok" > /etc/timezone

COPY . .

RUN npm i && npm run build:dist

EXPOSE 8008

CMD ["node", "./dist/server.js"]
