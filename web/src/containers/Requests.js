import axios from "axios";
import { useContext, useState } from "react";
import { Box, Button, Text } from "rebass";
import { WidthControlledContainer } from "../components/Containers";
import RequestForm from "../components/RequestForm";
import { ROLES } from "../constants";
import { AuthContext } from "../providers/AuthContext";
import { useAuth, useGetOrganizations } from "../utils/hooks"


const Requests = () => {
  const { state } = useContext(AuthContext)
  const {auth: role, fetching: authFetching} = useAuth();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const {orgs, fetching} =  useGetOrganizations(state.token.access_token);
  const orgsFound = !fetching && orgs && orgs.length;

  return (
    <WidthControlledContainer>
      {/* {orgsFound > 0  && <Text fontSize={7} textAlign="center" py={4}>Available Orgs</Text>}
      <Flex justifyContent="center">
        {orgsFound && orgs.map(org => <Organization {...org} key={org.id} />)}
      </Flex> */}
      <Box py={6} maxWidth={[800, 400, 600]} >
        <Text fontSize={4} mb={3}>This Github App is designed to provide a self-service workflow for gaining membership into a github org. Make a request for yourself or someone else. Based on your <a href="/rbac">rbac</a>, your requests will be either automatically approved or awaiting approval. Only authorized users may make or approve requests.
        </Text>
        {orgsFound && <Text fontSize={4}>There are <Text color="green" as="span">{orgs.length}</Text> org{orgs.length > 1 ? "s": ""} that this github app has been installed on.</Text>}
      </Box>
      <Box fontSize={5}>
        {orgsFound && !formSubmitted && !authFetching && role && <RequestForm username={state.isLoggedIn && state.user.login} organizations={orgs} isRequester={!authFetching && role === ROLES.REQUESTER} onSubmit={async data => {
          await axios.post('http://localhost:3001/requests',  
            data
          , {
            headers: {
              authorization: `Bearer ${state.token.access_token}`
            }
          })
          setFormSubmitted(true);
        }}/>}
      </Box>
      {orgsFound && formSubmitted && <Box>
        <Button bg="secondary" color="primary" onClick={() => setFormSubmitted(false)}>Request another invite</Button>
      </Box>}
    </WidthControlledContainer>)
}

export default Requests;