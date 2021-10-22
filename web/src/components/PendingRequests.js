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
                    return <Text key={index}>{item.login}</Text>
                }));
                setFetched(true); // should happen earlier
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
        <Box width={600} p={3} m={3} sx={{border: '1px solid', borderColor: 'primary'}}>
            {loading && <Text> Finding your pending requests...</Text>}
            {fetched && pendingRequests && <Text>{pendingRequests}</Text>}
            {error && <Text>{error}</Text>}
        </Box>
      )
}

export default PendingRequests;