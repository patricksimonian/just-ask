import axios from 'axios';
// cached value
const discovery = {
  initialized: null, 
  discovery: {}
};

async function getOidcDiscovery(discoveryEndpoint) {
  if (!discovery.initialized) {
    discovery.initialized = Date.now();
    try {
      const response = await axios.get(discoveryEndpoint);
      discovery.discovery = response.data;
    } catch (error) {
      log.error(`getOidcDiscovery: OIDC Discovery failed - ${error.message}`);
      throw error;
    }
  }
  log.info(`getOidcDiscovery cached ${discovery.initialized}`);
  return discovery.discovery;
}

export const getOidcDiscovery();