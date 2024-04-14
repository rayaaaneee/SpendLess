FROM node:21-alpine3.17

WORKDIR /app

COPY package*.json /app/

RUN apk update && apk upgrade
RUN apk add --no-cache sqlite

RUN npm install

COPY . /app/

EXPOSE 3000
