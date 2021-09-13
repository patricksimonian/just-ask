import ReactMarkdown from "react-markdown"

import remarkGfm from 'remark-gfm'
import { WidthControlledContainer } from "./Containers"

const CustomEntryPage = ({content}) => {
  return (<WidthControlledContainer ><ReactMarkdown  plugins={[remarkGfm]} children={content }/> </WidthControlledContainer>)
}

export default CustomEntryPage