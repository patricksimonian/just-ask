import { useContext } from 'react';
import {Box, Flex, Text} from 'rebass';
import { WidthControlledContainer } from '../components/Containers';
import { Notice } from '../components/Notice';
import Request from '../components/Request';
import { AuthContext } from '../providers/AuthContext';
import { useGetPendingRequests } from '../utils/hooks';

export const Approvals = () => {
  const { state } = useContext(AuthContext)

  const {pendingRequests, fetching} =  useGetPendingRequests(state.token.access_token);
  const thereArePendingRequests = !fetching && pendingRequests && pendingRequests.length;


  return (
    <WidthControlledContainer>
      <Box pt={4}>
        {!thereArePendingRequests && <Notice type="info">No Pending Requests!</Notice>}
        {thereArePendingRequests && <Text fontSize={5}>Pending Requests:</Text>}
        <Flex>
          {thereArePendingRequests && pendingRequests.map(r => <Request {...r} username={r.recipient} key={r._id} id={r._id} onApprove={(id) => console.log(id)} onDeny={id => console.log(id)} />)}
        </Flex>
      </Box>
    </WidthControlledContainer>
  )
}

export default Approvals