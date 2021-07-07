
import { Router, Link } from '@reach/router';
import Auth from './containers/Auth';
import Logout from './containers/Logout';
import Layout from './components/Layout';
import { useContext, useEffect } from 'react';
import { AuthContext } from './providers/AuthContext';
import NotLoggedIn from './components/NotLoggedIn';
import ApprovalRequestManager from './containers/ApprovalRequestManager';
import axios, { authInterceptor } from './axios';
import Shpeel from './components/Shpeel';
import Brand from './components/Brand';
import { WidthControlledContainer } from './components/Containers';
import { Box } from 'rebass';
import { Audits } from './containers/Audits';
import WithRole from './components/WithRole';
import { ROLES } from './constants';
import Toolbar from './components/Toolbar';


function App() {
  const {state, dispatch} = useContext(AuthContext);
  const token = state.token && state.token.access_token
  useEffect(() => {
    if(state.isLoggedIn) {
      // check if token is still working
      axios.get('/verify')
      .then(res => {
        if(res.status !== 200) dispatch({type: 'LOGOUT'})
        authInterceptor.register(token);
      })
      .catch(() => {
        dispatch({type: 'LOGOUT'})
      })
    }
  }, [dispatch, state.isLoggedIn, token])
  return (
    <Layout>
      <Toolbar />
      <Router>
        {state.isLoggedIn && <ApprovalRequestManager path="/" />}

        {!state.isLoggedIn && <NotLoggedIn path="/" />}
        <Auth path="/auth" />

        <Logout path="/logout" />
        <Shpeel path="/about" />
        <Audits path="/audits" /> 
      </Router>
      
    </Layout>
  );
}

export default App;
