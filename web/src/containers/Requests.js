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
  const [loading, setLoading] = useState(false);
  const {orgs, fetching} =  useGetOrganizations(state.token.access_token);
  const orgsFound = !fetching && orgs && orgs.length;

  return (
    <WidthControlledContainer>
      <Box py={6} maxWidth={[800, 400, 600]} >
        {orgsFound && <Text fontSize={4}>There are <Text color="green" as="span">{orgs.length}</Text> org{orgs.length > 1 ? "s": ""} that this github app has been installed on.</Text>}
      </Box>
      <Box fontSize={5}>
        {loading && <Text> Loading !</Text>}
        {orgsFound && !formSubmitted && !authFetching && role && <RequestForm username={state.isLoggedIn && state.user.login} organizations={orgs} isRequester={!authFetching && role === ROLES.REQUESTER} onSubmit={data => {
          setLoading(true);
          axios.post('http://localhost:3001/requests',  
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
        <Button bg="secondary" color="primary" onClick={() => setFormSubmitted(false)}>Request another invite</Button>
      </Box>}
    </WidthControlledContainer>)
}

export default Requests;