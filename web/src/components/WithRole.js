import { useContext } from "react";
import { AuthContext } from "../providers/AuthContext";




const intersection = (a, b) => {
  return a.filter((x) => {
      return b.some((y) => {
          return Object.is(x, y);
      });
  });
};

const WithRole = ({roles, children}) => {

  const { state } = useContext(AuthContext);
  return state.roles && intersection(roles, state.roles).length > 0 ? children : null;
}


export default WithRole