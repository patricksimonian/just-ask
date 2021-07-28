import { useAuth } from "../utils/hooks"



const intersection = (a, b) => {
  return a.filter((x) => {
      return b.some((y) => {
          return Object.is(x, y);
      });
  });
};

const WithRole = ({roles, children}) => {
  const { auth: userRoles, fetching } = useAuth()

  return !fetching && userRoles && intersection(roles, userRoles).length > 0 ? children : null;
}


export default WithRole