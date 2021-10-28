import axios from "../axios";
import { Box, Text } from "rebass"
import { useEffect,useState } from "react"

const PendingRequests = ({username, organization}) => {
    const [fetched, setFetched] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [pendingRequests,  setPendingRequests] = useState(null)

    useEffect(() => {
        if(!fetched && !error) {
            setLoading(true)
            axios.get(`/user/getUserPendingInvitations`).then((res) => {
                setPendingRequests(res.data) 
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
    return (
        <Box sx={{border: '1px solid'}} marginTop='12px'>
            {loading && <Text> Finding your pending requests...</Text>}
            
            {fetched && pendingRequests && 
            <Text>Pending Requests: 
                {
                    pendingRequests.map((item => 
                        <div key={item.id}>
                            <div>Invitee: {item.login}</div>
                            <div>Invited on: {item.created_at}</div>
                            <div>Inviter: {item.inviter.login}</div>
                            <p/>
                        </div>
                    ))
                }
            </Text>}

            {error && <Text>{error}</Text>}
        </Box>
      )
}

export default PendingRequests;