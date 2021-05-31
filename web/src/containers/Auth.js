
import axios from '../axios';
import { useContext, useEffect, useState } from 'react';
import { WidthControlledContainer } from '../components/Containers';
import { Notice } from '../components/Notice';
import { GITHUB_API_URL } from '../constants';
import { AuthContext } from '../providers/AuthContext';

const Auth = ({navigate}) => {
  const [error, setError] = useState(null);
  const { dispatch } = useContext(AuthContext);
  const [requested, setRequested] = useState(false);
  
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  useEffect(() => {
    if(!requested) {
      if(code && !error) {
        setRequested(true);
        axios.post('/auth', { code, state })
        .then(async res => {
          const apiResponse = await axios.get(`${GITHUB_API_URL}/user`, {
            headers: {
              authorization: `Bearer ${res.data.access_token}`
            }
          })
          dispatch({
            type: 'LOGIN', 
            payload: {
              token: res.data,
              user: apiResponse.data,
              
          }
        })
        navigate('/')
        })
        .catch(e => {
          setError(e)
        })
    
      } else {
        setError(new Error('Github did not return a code'))
      }
    }
  }, [code, dispatch, error, navigate, requested, state]);
  
  
  return <WidthControlledContainer>{error ? <Notice type="error">{error.message}</Notice> : <h1>logging in</h1>}</WidthControlledContainer>
}

export default Auth;