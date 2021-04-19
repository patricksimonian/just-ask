import { Box } from "rebass";

// a width controlled container to preserve layouts
export const WidthControlledContainer = ({children, ...rest}) => (
  <Box {...rest}>
    <Box width={['100%', 400, 800, 1200]} mx="auto">{children}</Box> 
  </Box>
)