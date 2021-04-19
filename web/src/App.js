
import './App.css';
import { Router } from '@reach/router';
import Auth from './containers/Auth';
import Logout from './containers/Logout';
import Requests from './containers/Requests';
import Layout from './components/Layout';
import { useContext } from 'react';
import { AuthContext } from './providers/AuthContext';
import NotLoggedIn from './components/NotLoggedIn';

function App() {
  const {state} = useContext(AuthContext);
  return (
    <Layout>

      <Router>
        {state.isLoggedIn && <Requests path="/" /> }
        {!state.isLoggedIn && <NotLoggedIn path="/" />}
        <Auth path="/auth" />
        <Logout path="/logout" />
      </Router>
    </Layout>
  );
}

export default App;
