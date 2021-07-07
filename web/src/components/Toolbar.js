import { Link } from "@reach/router"
import { ROLES } from "../constants"
import { Box } from 'rebass';
import { WidthControlledContainer } from "./Containers"
import WithRole from "./WithRole"


const Toolbar = () => (
  <WidthControlledContainer>
    <Box as="span" pr={3}>

      <Link to="/">Home</Link>
    </Box>
    <Box as="span" pr={3}>
    <WithRole roles={[ROLES.AUDITOR]}>
      <Link to="/audits">Audits</Link>
    </WithRole>
    </Box>
  </WidthControlledContainer>
)

export default Toolbar;