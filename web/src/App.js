
import './App.css';
import { Router } from '@reach/router';
import Auth from './containers/Auth';
import Logout from './containers/Logout';
import Layout from './components/Layout';
import { useContext, useEffect } from 'react';
import { AuthContext } from './providers/AuthContext';
import NotLoggedIn from './components/NotLoggedIn';
import ApprovalRequestManager from './containers/ApprovalRequestManager';
import axios from 'axios';

function App() {
  const {state, dispatch} = useContext(AuthContext);
  const token = state.token && state.token.access_token
  useEffect(() => {
    if(state.isLoggedIn) {
      // check if token is still working
      axios.get('http://localhost:3001/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if(res.status !== 200) dispatch({type: 'LOGOUT'})
      })
      .catch(() => {
        dispatch({type: 'LOGOUT'})
      })
    }
  }, [dispatch, state.isLoggedIn, token])
  return (
    <Layout>
      <Router>
        {state.isLoggedIn && <ApprovalRequestManager path="/" />}

        {!state.isLoggedIn && <NotLoggedIn path="/" />}
        <Auth path="/auth" />

        <Logout path="/logout" />
      </Router>
    </Layout>
  );
}

export default App;
