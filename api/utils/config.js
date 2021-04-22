import { readFileSync } from 'fs'
import path from 'path'

const getBasePathWithFile = (file) => {
  process.env.NODE_ENV === 'production'
    ? `${process.env.CONFIG_PATH}/${file}`
    : path.join(__dirname, `../config/${file}`)
}
/**
 * returns the config file, opting to use a wrapper funciton over direct import to allow for
 * testability. File mocks can only be static :/
 */
export const getConfig = () => {
  const data = readFileSync(getBasePathWithFile('config.json'))
  return JSON.parse(data.toString())
}

/**
 * @returns role mapping configg
 */
export const getRoleMapping = () => {
  const data = readFileSync(getBasePathWithFile('role-mappers.json'))
  return JSON.parse(data.toString())
}

/** @returns github private key */
export const getGithubPrivateKey = () => {
  const data = readFileSync(getBasePathWithFile('github-private-key.pem'))
  return data.toString()
}
