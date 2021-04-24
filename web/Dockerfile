FROM node:14
USER 0
ENV BUILDER_VERSION 1.1
ENV CADDY_VERSION 2.1.1


RUN curl https://github.com/caddyserver/caddy/releases/download/v${CADDY_VERSION}/caddy_${CADDY_VERSION}_linux_amd64.tar.gz \
    -SL --header "Accept: application/tar+gzip, application/x-gzip, application/octet-stream" | \
    tar -zx -C /usr/bin/ && \
    chmod 0755 /usr/bin/caddy


RUN mkdir /opt/app
RUN mkdir /opt/app-root
RUN mkdir /opt/app-root/etc
RUN mkdir /opt/app-root/www
WORKDIR /opt/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

RUN mv build/* /opt/app-root/www

RUN cp Caddyfile /opt/app-root/etc/
# cleanup react app
RUN rm -rf /opt/app 

RUN chmod -R 775 /opt/app-root/*
WORKDIR /opt/app-root/www

EXPOSE 2015
CMD ["/usr/bin/caddy", "run", "--config", "/opt/app-root/etc/Caddyfile"]