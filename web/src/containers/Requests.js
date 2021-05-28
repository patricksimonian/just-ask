import axios from "../axios";
import { useContext, useState } from "react";
import { Box, Button, Text } from "rebass";
import { WidthControlledContainer } from "../components/Containers";
import RequestForm from "../components/RequestForm";
import { ROLES } from "../constants";
import { AuthContext } from "../providers/AuthContext";
import { useAuth, useGetOrganizations } from "../utils/hooks"
import { Notice } from "../components/Notice";


const Requests = () => {
  const { state } = useContext(AuthContext)
  const {auth: role, fetching: authFetching} = useAuth();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const {orgs, fetching} =  useGetOrganizations();
  const orgsFound = !fetching && orgs && orgs.length;

  return (
    <WidthControlledContainer>
      <Box py={6} maxWidth={[800, 400, 600]} >
        {!orgsFound && !loading && !fetching && <Text fontSize={4}>Just.Ask has been misconfigured. Double check if the github app has been installed on at least one organization</Text>}
        <Text as="h2">Invitations</Text>
      </Box>
      
      <Box fontSize={5}>
        {(loading || fetching) && <Text> Loading...</Text>}
        {orgsFound && !formSubmitted && !authFetching && role && <RequestForm username={state.isLoggedIn && state.user.login} organizations={orgs} isRequester={!authFetching && role === ROLES.REQUESTER} onSubmit={data => {
          setLoading(true);
          axios.post('/requests',  
            data
          , {
            headers: {
              authorization: `Bearer ${state.token.access_token}`
            }
          })
          .then(() => {
            setFormSubmitted(true);
          })
          .finally(() => {
            setLoading(false);
          })
        }}/>}
      </Box>
      {orgsFound && formSubmitted && <Box>
        <Notice type="info" mb={4}>Invitation Created!</Notice>
        <Button bg="secondary" color="primary" sx={{cursor: 'pointer'}} onClick={() => setFormSubmitted(false)}>Request another invite</Button>
      </Box>}
    </WidthControlledContainer>)
}

export default Requests;