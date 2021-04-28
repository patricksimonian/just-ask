## Just Ask API

This is the API component that serves to track/approve requests as well as create audit trails. It is designed to closely couple to a Mongo Database

## To Run Locally

Pre-reqs:
1. You have a github have created
2. Obtain the Client Secret, Client Id, App Id, and Private Key from the Github App

Running Locally:
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
3. Copy and configure your config and rolemapper files `cp config/config.example.json config/config.json` etc.
4. Ensure you have your github app private key located at `config/github-private-key.pem
3. run api in dev mode `npm start`

## Testing

Tests are with `jest`. To run tests `npm run test` !

## Deployment

Running this application in production mode requires further configuration

### Running Single Container Instances via Docker in production

Apply these configurations to your container runtime
```yaml
  envVars:
    - CLIENT_SECRET {String}
    - CLIENT_ID {String}
    - APP_ID {Number}
    - CONFIG_PATH {String} the path where the node app will look for role-mappers, github-private-key, config.json etc
    - PORT {Number} defaults to 3001
    - MONGO_URL {String} fully qualified mongo url
    - WEB_URL {String fully qualified path to web for CORS}
  volumes:
    - name: role-mappers.json
      mountPath: /var/opt/config/role-mappers.json
    - name: github-private-key.pem
      mountPath: /var/opt/config/github-private-key.pem
    - name: config.json
      mountPath: /var/opt/config/config.json
```

eg: Docker

```sh
  docker run just-ask-server:<tag> \
  -e CLIENT_SECRET=... \
  -e CLIENT_ID=... 
  ... 
  -v path-to/role-mappers.json:/var/opt/config/role-mappers.json \ 
  ...
```

### Running In K8s

Ideally you will want to abstract away all configuration as ConfigMaps, Env Vars, and Secrets

```yaml
apiVersion: v1
stringData:
  GITHUB_PRIVATE_KEY: |
    BEGIN_PRIVATE_KEY
      ultrasecretkey
    END_PRIVATE_KEY
kind: Secret
metadata:
  creationTimestamp: null
  name: github-private-key

---
apiVersion: v1
stringData:
  role-mappers.json: |
    {
      "APPROVER": [
        {
          "kind": "OrgRole",
          "role": "owner",
          "name": "bcgov"
        },
        {
          "kind": "GithubTeam",
          "team": "OrgApprovers",
          "organization": "bcgov"
        }
      ],
      "REQUESTER": [null],
      "COLLABORATOR": [
        {
          "kind": "OrgRole",
          "role": "member",
          "name": "bcgov"
        }
      ]
    }
  config.json: |
    similar
kind: ConfigMap
metadata:
  creationTimestamp: null
  name: app-config
---
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: just-ask
  name: just-ask
spec:
  replicas: 1
  selector:
    matchLabels:
      app: just-ask
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: just-ask
    spec:
      volumes:
      - name: github-private-key
        secret: 
          secretName: github-private-key
      - name: app-config
        configMap: 
          name: app-config
      containers:
      - image: just-ask-server:latest
        name: just-ask
        volumeMounts:
          - name: github-private-key
            mountPath: /var/opt/config
          - name: app-config
            mountPath: /var/opt/config
        env:
          - name: CONFIG_PATH
            value: /var/opt/config
          - name: PORT
            value: 3001
          - name: CLIENT_ID
            value: foo
          - name: CLIENT_SECRET
            value: foo
          - name: APP_ID
            value: 3434
          # remaining env
        resources: {}
status: {}
```