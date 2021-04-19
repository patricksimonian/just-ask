import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import {useEffect} from 'react';
import Header from './components/Header';
import { Router } from '@reach/router';
import Auth from './containers/Auth';
import Logout from './containers/Logout';
import Layout from './components/Layout';

function App() {

  return (
    <Layout>
      <Router>
        <Auth path="/auth" />
        <Logout path="/logout" />
      </Router>
    </Layout>
  );
}

export default App;
