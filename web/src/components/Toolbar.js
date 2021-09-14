
import { ROLES } from "../constants"
import { Box } from 'rebass';
import { WidthControlledContainer } from "./Containers"
import WithRole from "./WithRole"
import NavLink from "./NavLink";


const Toolbar = () => (
  <WidthControlledContainer>
    <Box as="span" pr={3}>

      <NavLink to="/">Home</NavLink>
    </Box>
    <Box as="span" pr={3}>
    <WithRole roles={[ROLES.REQUESTER, ROLES.COLLABORATOR, ROLES.APPROVER]}>
      <NavLink to="/requests">Requests/Approvals</NavLink>
    </WithRole>
    </Box>
    <Box as="span" pr={3}>
    <WithRole roles={[ROLES.AUDITOR]}>
      <NavLink to="/audits">Audits</NavLink>
    </WithRole>
    </Box>
  </WidthControlledContainer>
)

export default Toolbar;