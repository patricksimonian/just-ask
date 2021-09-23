import { useTheme } from 'emotion-theming';
import { useContext } from 'react';
import { Flex, Image, Text, Link as RebassLink } from 'rebass';
import { Link } from '@reach/router';
import styled from '@emotion/styled'
import { AuthContext } from '../providers/AuthContext';
import { ContentContext } from '../providers/ContentProvider';
import { WidthControlledContainer } from './Containers';
import { v4 as uuidv4 } from 'uuid';
import githubLogo from '../images/github.png';
import { LOGIN_LINK } from '../constants';

const StyledLink = styled(Link)`
color: ${({theme}) => theme.colors.primaryText};
text-decoration: none;
  :visited {
    color: ${({theme}) => theme.colors.primaryText};
  }
`;
const Header = () =>{
  const content = useContext(ContentContext);
  const { state } = useContext(AuthContext);
  const theme = useTheme();
  
    return  (
    <WidthControlledContainer as="header" bg="primary"  style={{borderBottom: '2px solid', borderColor: theme.colors && theme.colors.secondary}}>
      <Flex color="secondary" justifyContent="space-between" alignItems="center">
        <StyledLink to="/" alignItems="center" flex="1 1 auto" >
          <Flex alignItems="center" flex="1 1 auto" >
            {content.brandLogo && <Image width={[75, 100 ]} pr={3} src={content.brandLogo} alt={content.brandTitle} /> }
            <Text as="h1" mb={0} fontSize={[7, 4, 5, 6]} >{content.brandTitle}</Text>
          </Flex>
        </StyledLink>

        {state.isLoggedIn ? <StyledLink to="/logout" >Logout {state.user.login}</StyledLink> : 
          <RebassLink sx={{display: 'flex', textDecoration: 'none', alignItems: 'center', color: theme.colors.primaryText, ':visited': {
            color: theme.colors.primaryText
          }}} href={`${LOGIN_LINK}&state=${uuidv4()}`} ><Image color={theme.colors.primaryText} mr={3} src={githubLogo} alt="github" width={25}/>Login</RebassLink>}

      </Flex>
    </WidthControlledContainer>
  )
};


export default Header;