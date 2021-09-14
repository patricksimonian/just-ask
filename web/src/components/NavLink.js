import { Link } from "@reach/router"
import { css , cx } from '@emotion/core'
import { useTheme } from "emotion-theming"


const NavLink = props => {
  const theme = useTheme()
  const isActive = ({ isCurrent }) => {

    return isCurrent ? { 
      style: {
        'text-decoration': 'underline',
        color: theme.colors.text,

      }
    } : {
      style: {
        color: theme.colors.text,
        '&visited': theme.colors.text,
        'text-decoration': 'none'

      }
    }
  }
  return <Link {...props} getProps={isActive} />
}

export default NavLink