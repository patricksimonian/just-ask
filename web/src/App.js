
import { Router, navigate, redirectTo } from '@reach/router';
import Auth from './containers/Auth';
import Logout from './containers/Logout';
import Layout from './components/Layout';
import { useContext, useEffect } from 'react';
import { AuthContext } from './providers/AuthContext';
import NotLoggedIn from './components/NotLoggedIn';
import ApprovalRequestManager from './containers/ApprovalRequestManager';
import axios, { authInterceptor } from './axios';
import Shpeel from './components/Shpeel';
import { Audits } from './containers/Audits';
import Toolbar from './components/Toolbar';
import { useConfig } from './utils/hooks';

import CustomEntryPage from './components/CustomEntry';
import Entry from './components/Entry';
import PrivateRoute from './components/PrivateRoute';
import { Initialization } from './components/Initialization';

function App() {

  const {state, dispatch} = useContext(AuthContext);
  const token = state.token && state.token.access_token
  const [ content, ,,, error ] = useConfig('/config/entry.md', {
    headers: {
      accept: 'text/markdown'
    }
  })

  useEffect(() => {
    if(state.isLoggedIn) {
      // check if token is still working
      axios.get('/verify')
      .then(res => {
        if(res.status !== 200) {
          dispatch({type: 'LOGOUT'})
          redirectTo("/");
        } else {
          authInterceptor.register(token);
        }
      })
      .catch((e) => {
        console.log('REDIRECTING')
        dispatch({type: 'LOGOUT'})
        redirectTo("/");
      })
    }
  }, [dispatch, state.isLoggedIn, token])

  return (
    <Layout>
      <Toolbar />
      <Initialization />
      <Router>

        {!state.isLoggedIn && !content && <NotLoggedIn path="/" />}
        
        {!error && content && <CustomEntryPage path="/" content={content}/>}
        { !content && state.isLoggedIn && <Entry path="/"/>}
        <Auth path="/auth" />

        <Logout path="/logout" />
        <Shpeel path="/about" />
        <PrivateRoute component={ApprovalRequestManager} path="/requests" />
        <PrivateRoute component={Audits} path="/audits" /> 
      </Router>
      
    </Layout>
  );
}


export default App;