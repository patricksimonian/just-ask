
import { Router, Link, Redirect, redirectTo, navigate } from '@reach/router';
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
import ReactMarkdown from 'react-markdown'
import { Box } from 'rebass';
import { Audits } from './containers/Audits';
import WithRole from './components/WithRole';
import { ROLES } from './constants';
import Toolbar from './components/Toolbar';
import { useConfig } from './utils/hooks';
import remarkGfm from 'remark-gfm'
import CustomEntryPage from './components/CustomEntry';
import Entry from './components/Entry';

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
        console.log(res)
        if(res.status !== 200) {
          dispatch({type: 'LOGOUT'})
          navigate("/");
        }
        authInterceptor.register(token);
      })
      .catch((e) => {
        console.log(e)
        dispatch({type: 'LOGOUT'})
        navigate("/");
      })
    }
  }, [dispatch, state.isLoggedIn, token])

  return (
    <Layout>
      <Toolbar />
      <Router>
        {state.isLoggedIn && <ApprovalRequestManager path="/requests" />}

        {!state.isLoggedIn && !content && <NotLoggedIn path="/" />}
        
        {!error && content && <CustomEntryPage path="/" content={content}/>}
        { !content && state.isLoggedIn && <Entry path="/"/>}
        <Auth path="/auth" />

        <Logout path="/logout" />
        <Shpeel path="/about" />
        <Audits path="/audits" /> 
      </Router>
      
    </Layout>
  );
}


export default App;