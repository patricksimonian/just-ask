import axios from "../axios";
import { Box, Button, Flex, Link, Text } from "rebass"
import { useGetUser } from "../utils/hooks"
import { useEffect, useMemo, useState } from "react"

const PendingRequests = ({username, organization}) => {
    const [fetched, setFetched] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [pendingRequests,  setPendingRequests] = useState(null)
    // const {user, fetching} = useGetUser( username)

    useEffect(() => {
        if(!fetched && !error) {
            setLoading(true)
            axios.get(`/requests/userPendingRequests`).then((res) => {
                setPendingRequests(res.data.map((item, index) => {
                    return (
                    <div display="flex" flex-direction="row">
                        <Text key={index}>Invitee: {item.login} </Text>
                        <Text>Invited on: {item.created_at}</Text>
                        <Text>Inviter: {item.inviter.login}</Text>
                        {item.failed_reason && <Text color="red">Failed: {item.failed_reason}</Text>}
                        <p/>
                    </div>
                    )
                }));
                setFetched(true);
            })
            .catch((e) => {
                setError(e.message)
            })
            .finally(() => {
                setLoading(false)
            })
        }
        
    }, [fetched, pendingRequests, setLoading, setError, setFetched, error])
    console.log(pendingRequests)
    return (
        <Box sx={{border: '1px solid'}} marginTop='12px'>
            {loading && <Text> Finding your pending requests...</Text>}
            {fetched && pendingRequests && <Text>Pending Requests: {pendingRequests}</Text>}
            {error && <Text>{error}</Text>}
        </Box>
      )
}

export default PendingRequests;