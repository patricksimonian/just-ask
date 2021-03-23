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