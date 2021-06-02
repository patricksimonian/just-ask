import { Box } from "rebass";
import Footer from "./Footer";
import Header from "./Header";


const Layout = ({children}) => (
  <Box>
    <Header />
    <main >
      {children}
    </main>
    <Footer />
  </Box>
)

export default Layout;