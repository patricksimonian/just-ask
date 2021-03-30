import { readFileSync } from 'fs';
import path from 'path';
/**
 * returns the config file, opting to use a wrapper funciton over direct import to allow for
 * testability. File mocks can only be static :/ 
 */
export const getConfig = () => {
  const data = readFileSync(path.join(__dirname, '../config/config.json'));
  return JSON.parse(data.toString());
}


/**
 * returns the sso config plus the discovery endpoint
 * @returns ssoConfig
 */
export const getSSO = () => {
  const data = readFileSync(path.join(__dirname, '../config/sso.json'));
  const json = JSON.parse(data.toString());

  return {
    ...json,
    discovery: `${json.baseURL}/auth/realms/${json.realm}/.well-known/openid-configuration`
  }
}