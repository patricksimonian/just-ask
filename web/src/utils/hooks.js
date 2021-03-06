import { useContext, useEffect, useState } from "react";
import axios from "../axios";
import Axios from 'axios';
import { parse } from "query-string"
import { GITHUB_API_URL } from "../constants";
import { AuthContext } from "../providers/AuthContext";
import { useLocation } from "@reach/router";


/**
 * 
 * @param {Array} params string of search params you want
 * @returns {Object} 
 */
export const useQueryParams = (params) => {
  const location = useLocation()
  const search = parse(location.search);

  return params.reduce((acc, p) => {
    acc[p] = search[p];
    return acc;
  }, {})
} 
/**
 * react hook to get our app config from a static path
 */
 export const useConfig = (filePath, axiosConfig) => {
  const [ config, setConfig ] = useState(null);
  const [ fetched, setFetched ] = useState(false);
  const [ fetching, setFetching ] = useState(false);
  const [ error, setError ] = useState(null);
  useEffect(() => {

    if(!config && !error) {
      setFetching(false);

      Axios.get(filePath, axiosConfig).then(response => {
        setFetched(true);
        setConfig(response.data)

      }).catch(e => {
        setFetched(false);
        setFetching(false);
        setError(e);
      })
    }
  }, [config, filePath, error, axiosConfig])

  return [config, fetched, fetching, error];
};

export const useOAuth = code => {
  const [OAuth, setOAuth] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    if(code) {
      const code = window.location.search.replace('?code=', '');
      axios.post('/auth', {code})
      .then(async res => {
        const apiResponse = await axios.get(`${GITHUB_API_URL}/user`, {
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
  
    } else {
      setError(new Error('Unable to complete authentication! Github did not return a code.'))
    }
  }, [code])
  return {OAuth, error}
}

export const useGetOrganizations =  () => {
  const [orgs, setOrgs] = useState(null);
  const [fetching, setFetching] = useState(null);
  useEffect(() => {
    setFetching(true);
    axios.get('/organizations').then(res => {
      setOrgs(res.data);
      setFetching(false);
    })
    .finally(() => {
      setFetching(false);
    })
  }, [])

  return {orgs, fetching}
}





export const useGetUser = (username) => {
  const [user, setUser] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if(!user) {

      setFetching(true);
      axios.get(`${GITHUB_API_URL}/users/${username}`)
      .then(res => {
        setUser(res.data)
      })
      .finally(() => {
        setFetching(false);
      })
    }
  }, [user, username])

  return {user, fetching}
}



export const useGetStats = () => {
  const [stats, setStats] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if(!stats) {

      setFetching(true);
      axios.get(`/stats`)
      .then(res => {
        setStats(res.data)
      })
      .finally(() => {
        setFetching(false);
      })
    }
  }, [stats])

  return {stats, fetching}
}
