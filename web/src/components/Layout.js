import { Box } from "rebass";
import Header from "./Header";


const Layout = ({children}) => (
  <Box>
    <Header />
    <main style={{height: '100vh'}}>
      {children}
    </main>
  </Box>
)

export default Layout;