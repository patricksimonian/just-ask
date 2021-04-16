import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import {useEffect} from 'react';

function App() {
  useEffect(() => {
    if(window.location.search.indexOf('?code=') >= 0) {
      const code = window.location.search.replace('?code=', '');
      axios.post('http://localhost:3001/auth', {code})
    }
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://github.com/login/oauth/authorize?client_id=Iv1.65fa64309c0ff4b6&redirect_uri=http://localhost:3000&callback_url=http://localhost:3000"
  
          rel="noopener noreferrer"
        >
          Login
        </a>
      </header>
    </div>
  );
}

export default App;
