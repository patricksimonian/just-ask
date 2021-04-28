import { Box } from "rebass";
import Header from "./Header";


const Layout = ({children}) => (
  <Box>
    <Header />
    <main >
      {children}
    </main>
  </Box>
)

export default Layout;