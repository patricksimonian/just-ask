import { Redirect } from "@reach/router";
import React, { useContext } from "react"
import { AuthContext } from "../providers/AuthContext"




const PrivateRoute = ({component: Component, ...rest}) => {
  const {state} = useContext(AuthContext);

  if (!state.isLoggedIn) {
    return <Redirect to="/" noThrow />
  }

  return <Component {...rest} />
}

export default PrivateRoute