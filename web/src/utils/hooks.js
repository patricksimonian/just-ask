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
        console.log(response);
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