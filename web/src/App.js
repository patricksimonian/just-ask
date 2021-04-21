
import './App.css';
import { Router } from '@reach/router';
import Auth from './containers/Auth';
import Logout from './containers/Logout';
import Layout from './components/Layout';
import { useContext } from 'react';
import { AuthContext } from './providers/AuthContext';
import NotLoggedIn from './components/NotLoggedIn';
import ApprovalRequestManager from './containers/ApprovalRequestManager';

function App() {
  const {state} = useContext(AuthContext);

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
