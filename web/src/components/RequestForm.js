
import { Form, Field } from 'react-final-form'
import { Input, Label, Checkbox, Textarea } from '@rebass/forms';
import { Box, Button, Flex, Image, Text } from 'rebass';
import React from 'react';


const RequestForm = ({autoSelectCheckboxes, organizations, onSubmit, isRequester, username = ''}) => {

  return (
    <Form
    onSubmit={onSubmit}
    initialValues={{
      organizations: autoSelectCheckboxes ? organizations.map(o => o.name): []
    }}
    render={({ handleSubmit }) => (
      <Box>
      <Flex onSubmit={handleSubmit} alignItems="center" py={4} flexWrap="wrap">
        
          <Text pr={4}>Request an invite for</Text>
          <Field name="user" defaultValue={isRequester ? username: '' }  render={({ input, meta }) => (
              <Box alignItems="center" pr={4}>
                {isRequester ? (
                  <React.Fragment>
                    <input type="hidden" {...input} />
                    <Text color="secondary" sx={{textDecoration: 'underline'}}>myself</Text>
                  </React.Fragment>
                )
              :
              (
                <Input placeholder="github id" {...input} maxWidth={[400, 300, 400]} />
              )}
                {meta.touched && meta.error && <span>{meta.error}</span>}
              </Box>
            )} />
  
              <Text pr={3}>to organizations: </Text>
            <Box  mr={4}>
  
        {organizations.map(org => (
          <Field type="checkbox" label={org.name} value={org.name} key={org.id} name="organizations"
          
          render={({ input, meta }) => (
            <Flex alignItems="center" flexDirection="column" py={1}>
  
                  <Label  alignItems="center" justifyContent="space-between">
                    <Image src={org.image} alt={org.name} width={35} />
                    <Text px={3}>
                      {org.name}
  
                    </Text>
                  <Checkbox  {...input} disabled={autoSelectCheckboxes} sx={{
                    bg: 'primary',
                    color: 'secondary',
                    outline: 'none',
                    'input:checked ~ &': {
                      bg: 'primary',
                      color: 'secondary'
                    },
                    'input:focus ~ &, input:active ~ &': {
                      bg: 'primary',
                      color: 'secondary'
                    },
                    'input:disabled ~ &': {
                      cursor: 'not-allowed',
                      bg: 'lightgrey',
                      color: 'grey',
                      opacity: .4,
                    },
                  }}/>
                  </Label>
                  {meta.touched && meta.error && <span>{meta.error}</span>}
                </Flex>
              )}/>
  
        ))}
            </Box>
      </Flex>
      <Box>
        <Box>
          <Text pr={4}>Reason for request</Text>
          <Field name="reason"  render={({ input, meta }) => (
              <Box alignItems="center" pr={4} py={3}>
                <Textarea placeholder="Inviting because.." {...input} width="100%"  sx={{ maxWidth: [800, 300, 500], resize: 'none', fontFamily: 'inherit'}}/>
                {meta.touched && meta.error && <span>{meta.error}</span>}
              </Box>
            )} />
        </Box>  
        <Button onClick={() => handleSubmit()} bg="secondary" p={3} fontSize={5} style={{cursor: 'pointer'}}>Request</Button>
      </Box>
      

      </Box>
    )}
  />
  )
}

export default RequestForm