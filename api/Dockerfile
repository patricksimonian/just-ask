FROM --platform=linux/amd64 node:18.19.0-alpine

RUN mkdir /var/opt/server
RUN mkdir /var/opt/config

WORKDIR /var/opt/build

COPY . .

RUN npm install
RUN npm run build
RUN rm -rf src

ENV CONFIG_PATH=/var/opt/config
ENV NODE_ENV=production
# https://chat.developer.gov.bc.ca/channel/devops-how-to?msg=4anwXBG6uRhQviJBt
ENV npm_config_cache /tmp/npm 


EXPOSE 3001

# RUN chown -R 1001:0 "/.npm"
CMD ["npm", "run", "start"]
