# Just Ask! Front end

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup
- copy and fill in the environment variables `cp .env.local.example .env.local`
- install packages `npm install`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Deployment

Running this application in production mode requires further configuration

### Running Single Container Instances via Docker

Apply these configurations to your container runtime
```yaml
  envVars:
    - REACT_APP_CLIENT_ID {String}
    - REACT_APP_API_URL {String}
  volumes:
    - name: pallete.json
      mountPath: /var/opt/config/role-mappers.json
    - name: content.json
      mountPath: /var/opt/config/config.json
```

eg: Docker

```sh
  docker run just-ask-web:<tag> \
  -e REACT_APP_CLIENT_ID=... \
  -e REACT_APP_API_URL=... \
  -v path-to/content.json:/var/opt/config/content.json \ 
  ...
```

### Running In K8s

Ideally you will want to abstract away all configuration as ConfigMaps, Env Vars, and Secrets

```yaml
apiVersion: v1
stringData:
  palette.json: |
    {
      "primary": "#00ffdd",
      "secondary": "#ae33da"
    }
  content.json: |
    {
      "brandTitle": "Just Ask!",
      "brandLogo": null
    }
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
      - name: app-config
        configMap: 
          name: app-config
      containers:
      - image: docker.io/wazzacky/just-ask-web:latest
        name: just-ask
        volumeMounts:
          - name: app-config
            mountPath: /opt/app-root/www/public/config
        env:
          - name: REACT_APP_CLIENT_ID
            value: foo
          - name: REACT_APP_API_BASE_URL
            value: http://localhost:3001
        resources: {}
status: {}
```