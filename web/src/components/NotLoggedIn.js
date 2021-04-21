import { Box, Text } from "rebass";
import { WidthControlledContainer } from "./Containers";



const NotLoggedIn = () => (
  <WidthControlledContainer>
    <Box pt={10}>
      <Text as="p" fontSize={4}>Login to get started</Text>
    </Box>
  </WidthControlledContainer>
)

export default NotLoggedIn