import axios from 'axios';
import log from 'log';
// cached value
const cache = {
  initialized: null,
  fetching: false,
  discovery: {}
};

export async function getOidcDiscovery(discoveryEndpoint) {
  if (!cache.initialized && !cache.fetching) {
    cache.fetching = true;
    try {
      const response = await axios.get(discoveryEndpoint);
      cache.initialized = Date.now();
      cache.discovery = response.data;
    } catch (error) {
      log.error(`getOidcDiscovery: OIDC Discovery failed - ${error.message}`);
      throw error;
    }
    cache.fetching = false;
  }
  log.info(`getOidcDiscovery cached ${cache.initialized}`);
  return cache.discovery;
}

