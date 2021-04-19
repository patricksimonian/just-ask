import axios from "axios";
import { useEffect, useState } from "react";

/**
 * react hook to get our app config from a static path
 */
 export const useConfig = (filePath) => {
  const [ config, setConfig ] = useState(null);
  const [ fetched, setFetched ] = useState(false);
  const [ fetching, setFetching ] = useState(false);
  const [ error, setError ] = useState(null);
  useEffect(() => {
    if(!config && !error) {
      setFetching(false);
      axios.get(filePath, {
        headers: {
          accept: 'application/json'
        }
      }).then(response => {
        setFetched(true);
        setFetching(false);
        setConfig(response.data)
      }).catch(e => {
        setFetched(false);
        setFetching(false);
        setError(e);
      })
    }
  }, [config, filePath, error])

  return [config, fetched, fetching, error];
};

export const useOAuth = code => {
  const [OAuth, setOAuth] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    if(window.location.search.indexOf('?code=') >= 0) {
      const code = window.location.search.replace('?code=', '');
      axios.post('http://localhost:3001/auth', {code})
      .then(async res => {
        const apiResponse = await axios.get('https://api.github.com/user', {
          headers: {
            authorization: `Bearer ${res.data.access_token}`
          }
        })
        setOAuth({
          token: res.data,
          user: apiResponse.data
        });

      })
      .catch(e => {
        setError(e)
      })
  
    }
  }, [])
  return {OAuth, error}
}