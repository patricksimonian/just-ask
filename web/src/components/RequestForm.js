
import { Form, Field } from 'react-final-form'
import { Input, Label, Checkbox } from '@rebass/forms';
import { Box, Button, Flex, Image, Text } from 'rebass';


const RequestForm = ({organizations, onSubmit}) => (
  <Form
  onSubmit={onSubmit}
  render={({ handleSubmit }) => (
    <Flex onSubmit={handleSubmit} alignItems="center" py={4}>
      
        <Text pr={4}>Request an invite for</Text>
        <Field name="user" render={({ input, meta }) => (
            <Box alignItems="center" pr={4}>
              <Input placeholder="github id" {...input} width={[400, 300, 400]} />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </Box>
          )} />

            <Text pr={3}>to organizations: </Text>
          <Box  mr={4}>

      {organizations.map(org => (
        <Field type="checkbox"  label={org.name} value={org.name} key={org.id} name="organizations"
        
        render={({ input, meta }) => (
          <Flex alignItems="center" flexDirection="column" py={1}>

                <Label  alignItems="center" justifyContent="space-between">
                  <Image src={org.image} alt={org.name} width={35} />
                  <Text px={3}>
                    {org.name}

                  </Text>
                
                <Checkbox  {...input} bg="secondary" color="black"/>
                </Label>
                {meta.touched && meta.error && <span>{meta.error}</span>}
              </Flex>
            )}/>

      ))}
          </Box>
        <Button onClick={() => handleSubmit()} bg="text" p={3} fontSize={5} style={{cursor: 'pointer'}}>Request</Button>
    </Flex>
  )}
/>
)

export default RequestForm