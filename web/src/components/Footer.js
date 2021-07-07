import { useContext } from "react";
import { Box, Flex, Link } from "rebass";
import { ContentContext } from "../providers/ContentProvider";
import Brand from "./Brand";
import { WidthControlledContainer } from "./Containers";

const Footer = () => {
  const content = useContext(ContentContext);

  return (
    <Box as="footer" sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} >
      <WidthControlledContainer>
        <Flex alignItems="center">
          <Brand />
          {content.issuesLink && <Link ml={5} href={content.issuesLink} color="text" sx={{':visited': {
            color: 'initial',
            textDecoration: 'none'
          }}}>Issues</Link> }

        </Flex>
      </WidthControlledContainer>
    </Box>

  )
}

export default Footer;

