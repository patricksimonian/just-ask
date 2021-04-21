import { useContext } from "react"
import { Box, Button, Flex, Image, Link, Text } from "rebass"
import { AuthContext } from "../providers/AuthContext"
import { useGetUser } from "../utils/hooks"



const Request = ({username, id, organization, state: requestState, onApprove, onDeny}) => {
  const { state } = useContext(AuthContext)
  const {user, fetching} = useGetUser(state.token.access_token, username)

  return (
    <Box with={300} p={3} m={3} sx={{border: '1px solid', borderColor: 'primary'}}>
      <Flex alignItems="center">
        <Link href={`https://github.com/${username}`} sx={{':visited': {
          textDecoration: 'none',
          color: 'initial'
        }}}>
          {!fetching && user && <Image src={user.avatar_url} alt={username} width={40}/>}
          {fetching && !user && <Flex alignItems="center" justifyContent="center" width={40} height={40} bg="primary" color="secondary"><Text fontSize={6} style={{textTransform: 'uppercase'}}>{username.charAt(0)}</Text></Flex >}
        </Link>
        <Text as="span" ml={4} fontSize={4}>{username} to {organization}</Text>
      </Flex>
      <Box py={4}>
        <Button mr={4} bg="primary" color="secondary" onClick={() => onApprove(id)}>Approve</Button>
        <Button bg="red" color="white" onClick={() => onDeny(id)}>Deny</Button>
      </Box>
    </Box>
  )
}

export default Request;