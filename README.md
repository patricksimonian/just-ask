## Getting Started



## To Run Locally

1. Run a Mongo Instance (docker being the quickest) `docker run mongo:4.4.5`
2. change into api directory and update env information
```sh
cd api
# fill in env 
cp .env.example .env

### Sample env contents
CLIENT_ID=foo
CLIENT_SECRET=bar
APP_ID=baz
PORT=3001
WEB_URL=http://localhost:3000
MONGO_URL=mongodb://localhost:27017/dbname
```
3. run api in dev mode `npm start`