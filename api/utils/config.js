import { readFileSync } from "fs";
import path from "path";
/**
 * returns the config file, opting to use a wrapper funciton over direct import to allow for
 * testability. File mocks can only be static :/
 */
export const getConfig = () => {
  const data = readFileSync(path.join(__dirname, "../config/config.json"));
  return JSON.parse(data.toString());
};

/**
 * @returns role mapping configg
 */
export const getRoleMapping = () => {
  const data = readFileSync(
    path.join(__dirname, "../config/role-mappers.json")
  );
  return JSON.parse(data.toString());
};

/** @returns github private key */
export const getGithubPrivateKey = () => {
  const data = readFileSync(
    path.join(__dirname, "../config/github-private-key.pem")
  );
  return data.toString();
};
