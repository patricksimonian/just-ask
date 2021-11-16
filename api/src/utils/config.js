import { readFileSync } from 'fs'
import log from 'log'
import path from 'path'

/**
 * Converts a Buffer to JSON but prints out a friendly log error message when JSON fails to parse
 * @param {String} fileName
 * @param {Buffer} data
 * @returns {Object}
 */
export const getJsonFromBuffer = (fileName, data) => {
  try {
    return JSON.parse(data.toString())
  } catch (e) {
    log.error(`Unable to parse JSON for ${fileName}.`)
    log.error(e)
    throw e
  }
}

export const getBasePathWithFile = (file) => {
  let filePath
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.PRIVATE_KEY_PATH &&
    file === 'github-private-key.pem'
  ) {
    filePath = `${process.env.PRIVATE_KEY_PATH}/${file}`
  } else if (process.env.NODE_ENV === 'production' && process.env.CONFIG_PATH) {
    filePath = `${process.env.CONFIG_PATH}/${file}`
  } else {
    filePath = path.join(__dirname, `../config/${file}`)
  }
  log.info(`Loading ${file} from ${filePath}`)
  return filePath
}
/**
 * returns the config file, opting to use a wrapper funciton over direct import to allow for
 * testability. File mocks can only be static :/
 */
export const getConfig = () => {
  const file = 'config.json'
  const data = readFileSync(getBasePathWithFile(file))
  return getJsonFromBuffer(file, data)
}

/**
 * @returns role mapping configg
 */
export const getRoleMapping = () => {
  const file = 'role-mappers.json'
  const data = readFileSync(getBasePathWithFile(file))
  return getJsonFromBuffer(file, data)
}

/** @returns github private key */
export const getGithubPrivateKey = () => {
  const data = readFileSync(getBasePathWithFile('github-private-key.pem'))
  return data.toString()
}

/** @returns cors policy */
export const getCors = () => {
  const file = 'cors.json'
  const data = readFileSync(getBasePathWithFile(file))
  return getJsonFromBuffer(file, data)
}
