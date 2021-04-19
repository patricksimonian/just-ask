import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './defaults/fonts.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DynamicThemeProvider } from './providers/dynamicThemeProvider';
import { ContentProvider } from './providers/ContentProvider';
import AuthProvider from './providers/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <DynamicThemeProvider>
      <ContentProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ContentProvider>
    </DynamicThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
