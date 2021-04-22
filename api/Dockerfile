FROM node:14

RUN mkdir /var/opt/server

RUN mkdir /var/opt/config

WORKDIR /var/opt/server

COPY . .

RUN npm install

ENV CONFIG_PATH=/var/opt/config

EXPOSE 3001

CMD ["node", "bundle.js"]
