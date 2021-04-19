import { useTheme } from 'emotion-theming';
import { useContext } from 'react';
import { Flex, Text } from 'rebass';
import { ContentContext } from '../providers/ContentProvider';
import { WidthControlledContainer } from './Containers';



const Header = () =>{
  const content = useContext(ContentContext);
  const theme = useTheme();

  return  (
    <WidthControlledContainer as="header" bg="primary" py={8} px={6} style={{borderBottom: '2px solid', borderColor: theme.colors && theme.colors.secondary, fontFamily: "'Orbitron', sans-serif"}}>
      <Flex color="secondary" justifyContent="space-between" alignItems="center">
        
        <Text as="h1" mb={0}  >{content.brandTitle}</Text>
        <span>auth</span>

      </Flex>
    </WidthControlledContainer>
  )
};


export default Header;