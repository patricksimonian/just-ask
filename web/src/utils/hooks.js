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

export const useGetOrganizations =  (accessToken) => {
  const [orgs, setOrgs] = useState(null);
  const [fetching, setFetching] = useState(null);
  useEffect(() => {
    setFetching(true);
    axios.get('http://localhost:3001/organizations', {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    }).then(res => {
      setOrgs(res.data);
      setFetching(false);
    })
    .finally(() => {
      setFetching(false);
    })
  }, [accessToken])

  return {orgs, fetching}
}


export const useGetPendingRequests =  (accessToken) => {
  const [pendingRequests, setPendingRequests] = useState(null);
  const [fetching, setFetching] = useState(null);
  useEffect(() => {
    setFetching(true);
    axios.get('http://localhost:3001/requests?state=PENDING', {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    }).then(res => {
      setPendingRequests(res.data);
      setFetching(false);
    })
  }, [accessToken])

  return {pendingRequests, fetching}
}

export const useGetUser = (accessToken, username) => {
  const [user, setUser] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if(!user) {

      setFetching(true);
      axios.get(`https://api.github.com/users/${username}`, {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })
      .then(res => {
        setFetching(false);
        setUser(res.data)
      })
      .finally(() => {
        setFetching(false);
      })
    }
  }, [user, accessToken, username])

  return {user, fetching}
}