import ReactMarkdown from "react-markdown"
import Handlebars from 'handlebars'
import remarkGfm from 'remark-gfm'
import { WidthControlledContainer } from "./Containers"
import { LOGIN_LINK } from "../constants"
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from 'emotion-theming';
import { css } from '@emotion/core';

const CustomEntryPage = ({ content }) => {
  const template = Handlebars.compile(content)
  const theme = useTheme();
  const loginLink = `${LOGIN_LINK}&state=${uuidv4()}`;

  const templateVars = {
    login_link: loginLink
  }

  const styled = css`
    a[href="${loginLink}"] {
      background-color: ${theme.colors.primary};
      color: ${theme.colors.primaryText};
      text-decoration: none;
      cursor: pointer;
      padding: ${theme.space[2]} ${theme.space[6]};
      border-radius: ${theme.space[1]};
      font-size: ${theme.fontSizes[3]};
      font-weight: 500;
      text-transform: uppercase;
      &:visited {
        background-color: ${theme.colors.primary};
        color: ${theme.colors.primaryText};
      }
    }
  `

  return (
    <WidthControlledContainer css={styled}>
      <ReactMarkdown plugins={[remarkGfm]} children={template(templateVars)} />
    </WidthControlledContainer>
  )
}

export default CustomEntryPage