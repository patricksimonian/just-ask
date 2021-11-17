import log from 'log'
import { getCors } from './config'

/**
 * checks if verify cors urls
 * @param {[]string} urls urls from env var or config
 * @returns {Boolean}
 */
export const verifyCorsUrls = (urls) =>
  urls.every((url) => /https?:\/\//.test(url))

/**
 * gets cors policy from config
 * @param {string} webUrl
 * @returns {[]string}
 */
export const getCorsPolicy = (webUrl = undefined) => {
  let corsUrls = []
  let corsFromConfig
  try {
    corsFromConfig = getCors()
  } catch (e) {
    log.info('no cors.json file found')
    corsFromConfig = null
  }

  if (webUrl && webUrl !== null) {
    if (verifyCorsUrls([webUrl])) {
      corsUrls.push(webUrl)
    } else {
      log.warn(
        `Attempted to configure cors with WEB_URL ${webUrl} but it was invalid and failed the regex "https?://"`
      )
    }
  }
  // verify cors urls are valid
  if (corsFromConfig && !verifyCorsUrls(corsFromConfig)) {
    log.warn(
      `Attempted to configure cors from config cors.json ${corsFromConfig} but it was invalid and failed the regex "https?://"`
    )
  }

  if (corsFromConfig) {
    corsUrls = corsUrls.concat(corsFromConfig)
  }
  return corsUrls
}

export const handleCors = (origin, callback) => {
  const allowList = getCorsPolicy(process.env.WEB_URL)
  if (allowList.indexOf(origin) !== -1) {
    callback(null, true)
  } else {
    callback(new Error('Not allowed by CORS'))
  }
}
