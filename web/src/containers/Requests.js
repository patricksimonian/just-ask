import { useContext } from "react";
import { Flex, Text } from "rebass";
import { WidthControlledContainer } from "../components/Containers";
import Organization from "../components/Organization";
import { AuthContext } from "../providers/AuthContext";
import { useGetOrganizations } from "../utils/hooks"


const Requests = () => {
  const { state } = useContext(AuthContext)

  const {orgs, fetching} =  useGetOrganizations(state.token.access_token);
  return (
    <WidthControlledContainer>
      {!fetching && orgs.length > 0  && <Text fontSize={7} textAlign="center" py={4}>Available Orgs</Text>}
      <Flex justifyContent="center">
        {!fetching && orgs && orgs.map(org => <Organization {...org} key={org.id} />)}
      </Flex>
    </WidthControlledContainer>)
}

export default Requests;