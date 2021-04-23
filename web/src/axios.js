import axios from "axios";
import config from "./config";

const instance = axios.create({
  baseURL: config.API_BASE_URL
});

/**
 * simple wrapper against registering and unregistering the bearer token header
 */
export const authInterceptor = (() => {
  let requestInterceptor;
  return {
    register: accessToken => {
      requestInterceptor = instance.interceptors.request.use(config => {
        config.headers.authorization = `Bearer ${accessToken}`;
        return config;
      })
    },
    unregister: () => {
      if(requestInterceptor !== null) {
        instance.interceptors.request.eject(requestInterceptor);
        requestInterceptor = null;
      }
    }
  }
})();


export default instance;