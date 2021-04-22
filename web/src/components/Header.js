import { useTheme } from 'emotion-theming';
import { useContext } from 'react';
import { Flex, Image, Text } from 'rebass';
import { AuthContext } from '../providers/AuthContext';
import { ContentContext } from '../providers/ContentProvider';
import { WidthControlledContainer } from './Containers';


import { Link } from '@reach/router';

const Header = () =>{
  const content = useContext(ContentContext);
  const {state} = useContext(AuthContext);
  const theme = useTheme();
  console.log(theme);
    return  (
    <WidthControlledContainer as="header" bg="primary"  style={{borderBottom: '2px solid', borderColor: theme.colors && theme.colors.secondary, fontFamily: "'Orbitron', sans-serif"}}>
      <Flex color="secondary" justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" flex="1 1 auto">
          <Image width={[75, 100 ]} src={content.brandLogo} alt={content.brandTitle} />
          <Text as="h1" mb={0} fontSize={[4, 4, 4, 7]} >{content.brandTitle}</Text>
        </Flex>
        {state.isLoggedIn ? <Link to="/logout" >Logout {state.user.login}</Link> : <a style={{display: 'flex', alignItems: 'center'}} href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${window.location.origin}/auth&callback_url=${window.location.origin}/auth`} ><Image mr={3} src="/github.png" alt="github" width={25}/>Login</a>}

      </Flex>
    </WidthControlledContainer>
  )
};


export default Header;