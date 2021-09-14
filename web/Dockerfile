FROM node:16.9-alpine as builder
USER 0
ENV BUILDER_VERSION 1.1

RUN mkdir /opt/app

WORKDIR /opt/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

FROM caddy:2.4.5-alpine
## Default dir for caddy iamge

RUN mkdir /opt/app-root
RUN mkdir /opt/app-root/etc

WORKDIR /opt/app-root/www

COPY --from=builder /opt/app/build .
COPY Caddyfile /opt/app-root/etc 

RUN caddy fmt /opt/app-root/etc/Caddyfile --overwrite

RUN chmod -R 775 /opt/app-root/*
WORKDIR /opt/app-root/www

EXPOSE 2015
CMD ["/usr/bin/caddy", "run", "--config", "/opt/app-root/etc/Caddyfile"]