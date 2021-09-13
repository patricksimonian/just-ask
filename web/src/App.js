
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
import ReactMarkdown from 'react-markdown'
import { Box } from 'rebass';
import { Audits } from './containers/Audits';
import WithRole from './components/WithRole';
import { ROLES } from './constants';
import Toolbar from './components/Toolbar';
import { useConfig } from './utils/hooks';
import remarkGfm from 'remark-gfm'
import CustomEntryPage from './components/CustomEntry';

function App() {

  const {state, dispatch} = useContext(AuthContext);
  const token = state.token && state.token.access_token
  const [ content, fetched,, error ] = useConfig('/config/entry.md', {
    headers: {
      accept: 'text/markdown'
    }
  })
  console.log('CONTENT', content, fetched)
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
        {state.isLoggedIn && <ApprovalRequestManager path="/requests" />}

        {!state.isLoggedIn && error && <NotLoggedIn path="/" />}
        {console.log(!error && content, 'CTES', typeof content)}
        {!error && content && <CustomEntryPage path="/" content={content}/>}
        <Auth path="/auth" />

        <Logout path="/logout" />
        <Shpeel path="/about" />
        <Audits path="/audits" /> 
      </Router>
      
    </Layout>
  );
}

export default App;
