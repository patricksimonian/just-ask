import React, { createContext, useReducer } from 'react';
import { authInterceptor } from '../axios';


export const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: JSON.parse(localStorage.getItem('token')) || null,
};

export const reducer = (state, action) => {
  console.log(state, action);
  switch (action.type) {
    case "LOGIN": {
      localStorage.setItem("isLoggedIn", true)
      localStorage.setItem("user", JSON.stringify(action.payload.user))
      localStorage.setItem("token", JSON.stringify(action.payload.token))
      authInterceptor.register(action.payload.token.access_token);
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        token: action.payload.token
      };
    }
    case "LOGOUT": {
      authInterceptor.unregister();
      localStorage.clear()
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        token: null,
      };
    }
    default:
      return state;
  }
};

export const AuthContext = createContext();


const AuthProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return <AuthContext.Provider value={{state, dispatch}}>{children}</AuthContext.Provider>
}

export default AuthProvider