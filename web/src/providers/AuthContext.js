import React, { createContext, useReducer } from 'react';
import { authInterceptor } from '../axios';


export const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: JSON.parse(localStorage.getItem('token')) || null,
  roles: null,
};

export const reducer = (state, action) => {

  switch (action.type) {
    case "LOGIN": {
      localStorage.setItem("isLoggedIn", true)
      localStorage.setItem("user", JSON.stringify(action.payload.user))
      localStorage.setItem("token", JSON.stringify(action.payload.token))
      localStorage.setItem("roles", action.payload.roles)

      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        token: action.payload.token,
        roles: action.payload.roles
      };
    }
    case "LOGOUT": {
      authInterceptor.unregister();
      localStorage.clear()
      return initialState;
    }
    case "SET_ROLE": {
      return {
        ...state,
        roles: action.payload.roles
      }
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