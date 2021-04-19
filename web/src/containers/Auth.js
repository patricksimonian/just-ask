
import { Redirect } from '@reach/router';
import { useContext, useEffect, useState } from 'react';
import { WidthControlledContainer } from '../components/Containers';
import { AuthContext } from '../providers/AuthContext';
import { useOAuth } from '../utils/hooks';

const Auth = () => {
  
  const { OAuth, error } = useOAuth(window.location.search.replace('?code=', ''))

  const [authComplete, setAuthComplete] = useState(false);
  const { dispatch} = useContext(AuthContext);

  useEffect(() => {
    if(OAuth !== null) {
      dispatch({type: 'LOGIN', payload: OAuth})
      setAuthComplete(true); 
    } 
  }, [authComplete, OAuth, dispatch, setAuthComplete]);

  if(authComplete) {
    return <Redirect from="/auth" to="/" />
  }

  if(error) {
    throw error;
  }

  return <WidthControlledContainer><h1>logging in</h1></WidthControlledContainer>
}

export default Auth;