import axios from "../axios";
import { Box, Button, Flex, Link, Text } from "rebass"
import { useGetUser } from "../utils/hooks"

const PendingRequests = ({username, organization}) => {
   // const {user, fetching} = useGetUser( username)
    var results = "nothing has been returned by the server"
    axios.get(`/requests/userPendingRequests`).then((res) => {
        results = res
    });
    return (
        <Box width={600} p={3} m={3} sx={{border: '1px solid', borderColor: 'primary'}}>
            {results}
        </Box>
      )
}

export default PendingRequests;