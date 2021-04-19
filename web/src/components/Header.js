import { useTheme } from 'emotion-theming';
import { useContext } from 'react';
import { Flex, Text } from 'rebass';
import { AuthContext } from '../providers/AuthContext';
import { ContentContext } from '../providers/ContentProvider';
import { WidthControlledContainer } from './Containers';


import { Link } from '@reach/router';
const Header = () =>{
  const content = useContext(ContentContext);
  const {state} = useContext(AuthContext);
  const theme = useTheme();
  console.log(state);
  return  (
    <WidthControlledContainer as="header" bg="primary" py={8} px={6} style={{borderBottom: '2px solid', borderColor: theme.colors && theme.colors.secondary, fontFamily: "'Orbitron', sans-serif"}}>
      <Flex color="secondary" justifyContent="space-between" alignItems="center">
        
        <Text as="h1" mb={0}  >{content.brandTitle}</Text>
        {state.isLoggedIn ? <Link to="/logout" >Logout {state.user.login}</Link> : <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${window.location.origin}/auth&callback_url=${window.location.origin}/auth`} >Login</a>}

      </Flex>
    </WidthControlledContainer>
  )
};


export default Header;