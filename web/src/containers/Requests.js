import { useContext } from "react";
import { WidthControlledContainer } from "../components/Containers";
import Organization from "../components/Organization";
import { AuthContext } from "../providers/AuthContext";
import { useGetOrganizations } from "../utils/hooks"


const Requests = () => {
  const { state } = useContext(AuthContext)

  const {orgs, fetching} =  useGetOrganizations(state.token.access_token);
  return (
    <WidthControlledContainer>
      {!fetching && orgs && orgs.map(org => <Organization {...org} key={org.id} />)}
    </WidthControlledContainer>)
}

export default Requests;