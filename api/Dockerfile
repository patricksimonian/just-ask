FROM node:16.9-alpine

RUN mkdir /var/opt/server
RUN mkdir /var/opt/config

WORKDIR /var/opt/build

COPY . .

RUN npm install
RUN npm run build
RUN rm -rf src

ENV CONFIG_PATH=/var/opt/config
ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm", "run", "start"]
