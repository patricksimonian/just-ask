
import { navigate } from '@reach/router';
import { useContext, useEffect } from 'react';
import { WidthControlledContainer } from '../components/Containers';
import { AuthContext } from '../providers/AuthContext';


const Logout = () => {

  const { dispatch } = useContext(AuthContext);

  useEffect(() => {

      dispatch({type: 'LOGOUT',})
      navigate("/")
  }, [dispatch]);

  

  return <WidthControlledContainer><h1>Logged out!</h1></WidthControlledContainer>
}

export default Logout;