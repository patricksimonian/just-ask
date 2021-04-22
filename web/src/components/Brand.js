import { Link } from "@reach/router";
import { Box,  Image, Text } from "rebass"
import robot from '../images/robot.png';

const Brand = () => (
  <Link to="/about">

    <Box pr={10} mr={4} sx={{position: 'relative', display: 'inline-block', transition: 'all .25s', ':hover': {
      transform: 'translateY(4px)', 
    }}}>
      <Image width={[80 ]} src={robot} alt="Just Ask!" />
      <Text as="span" mb={0} color="secondary" fontSize={3} sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        transform: 'rotateZ(-12deg)', 
      }} >Just Ask!</Text>
    </Box>
  </Link>
)


export default Brand;