import { useAuth } from "../utils/hooks"



const WithRole = ({roles, children}) => {
  const { auth: role, fetching } = useAuth()

  return !fetching && role && roles.includes(role) ? children : null;
}


export default WithRole