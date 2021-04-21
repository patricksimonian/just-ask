import { Box } from "rebass";

// a width controlled container to preserve layouts
export const WidthControlledContainer = ({children, ...rest}) => (
  <Box {...rest}>
    <Box maxWidth={[1400, 400, 800, 1200]} mx="auto" p={[3, 4, 4]}>{children}</Box> 
  </Box>
)