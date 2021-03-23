import {
  createAppAuth,
} from "@octokit/auth";
import { request } from "@octokit/request";
import { readFileSync } from 'fs';
import {  every, intersectionBy, isArray,  isObject, isString } from "lodash";
import path from 'path';
import { getConfig } from "./config";
import log from 'log';


const file = readFileSync(path.join(__dirname, '../config/github-private-key.pem'));

const installationApps = {
  initialized: Date.now(),
  apps: {}
};

log.info('installedApps initialized');

const auth = createAppAuth({
  appId: process.env.APP_ID,
  privateKey: file.toString(),
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

const requestWithAuth = request.defaults({
  request: {
    hook: auth.hook,
  },
  mediaType: {
    previews: ["machine-man"],
  },
});



export const getInstallations = async () => {
  const response = await requestWithAuth('GET /app/installations');
  return response.data;
}

export const getOrgInstallations = async () => {
  const config = getConfig();

  if(!isObject(config) || !isArray(config.orgs) || !every(config.orgs, isString) || config.orgs.length === 0) {
    throw new Error('FOO!');
  }
  const installations = await getInstallations();

    
  const matchedInstallations = intersectionBy( installations, config.orgs.map(org => ({ account: {login: org}})), 'account.login')
  .filter(installation => installation.target_type === 'Organization')
  if(matchedInstallations.length === 0) {
    log.info(`This github app has no public org installations yet`);
  }
  return matchedInstallations;
}

const newAuthorizedApp = installationId => {
  const app =  createAppAuth({
    appId: process.env.APP_ID,
    privateKey: file.toString(),
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    installationId,
  });
  
  return {
    initialized: Date.now(),
    app,
    id: installationId,
    authenticatedRequest:  request.defaults({
      request: {
        hook: app.hook,
      },
      mediaType: {
        previews: ["machine-man"],
      },
    })
  }
}
/**
 * a new authenticated app must be created for every installation in order to invite users
 */
const getAuthenticatedApps = async () => {
  const installations = await getOrgInstallations();

  installations.forEach(installation => {
    const name = installation.account.login.toLowerCase();
    if(!installationApps.apps[name]) {
      installationApps.apps[name] = newAuthorizedApp(installation.id);
    }

  });

  return installationApps;
}

export default getAuthenticatedApps;