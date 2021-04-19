import { Flex } from 'rebass';
import { WidthControlledContainer } from './Containers';



const Header = () => (

  <WidthControlledContainer as="header" bg="primary" py={8} px={6}>
    <Flex color="text">
      <span>brandlogo</span>
      <span>brand</span>

      <span>auth</span>
    </Flex>
  </WidthControlledContainer>
);


export default Header;