import { Box } from "rebass";
import Footer from "./Footer";
import Header from "./Header";


const Layout = ({children}) => (
  <Box pb="100px" >
    <Header />
    <main >
      {children}
    </main>
    <Footer />
  </Box>
)

export default Layout;