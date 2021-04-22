
import { Redirect } from '@reach/router';
import { useContext, useEffect } from 'react';
import { WidthControlledContainer } from '../components/Containers';
import { Notice } from '../components/Notice';
import { AuthContext } from '../providers/AuthContext';
import { useOAuth } from '../utils/hooks';

const Auth = () => {
  const params = new URLSearchParams(window.location.search);
  const { OAuth, error } = useOAuth(params.get('code'))

  const {state, dispatch} = useContext(AuthContext);
  
  useEffect(() => {
    if(OAuth !== null) {
      dispatch({type: 'LOGIN', payload: OAuth})
    }
  }, [OAuth, dispatch]);
  

  if(state.isLoggedIn) {
    window.location.search = ''
    return <Redirect to="/"  noThrow/>
  }

  

  return <WidthControlledContainer>{error ? <Notice type="error">{error.message}</Notice> : <h1>logging in</h1>}</WidthControlledContainer>
}

export default Auth;