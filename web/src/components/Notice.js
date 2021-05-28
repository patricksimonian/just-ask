import {Box} from 'rebass'


const typeMapping = {
  info: {
    bg: '#D5F2E3',
    color: 'text'
  },
  warn: {
    color: 'text',
    bg: '#E3D888'
  },
  error: {
    bg: '#F46036',
    color: 'white'
  }
}

/**
 * Notice
 * @param {Object} props
 * @param {Object} props.type info|warn|error
 * @returns 
 */
export const Notice = ({type, children, ...rest}) => (
  <Box
    maxWidth={400}
    sx={{
      display: 'block',
      px: 5,
      py: 4,
   
      borderRadius: 0,
      ...typeMapping[type]
    }} {...rest}>
    {children}
  </Box>
)

