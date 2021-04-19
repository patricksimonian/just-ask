
import './App.css';
import { Router } from '@reach/router';
import Auth from './containers/Auth';
import Logout from './containers/Logout';
import Requests from './containers/Requests';
import Layout from './components/Layout';

function App() {

  return (
    <Layout>

      <Router>
        <Requests path="/" />
        <Auth path="/auth" />
        <Logout path="/logout" />
      </Router>
    </Layout>
  );
}

export default App;
