import {  Flex, Image, Text } from "rebass";


const Organization = ({id, name, image}) => (
  <Flex data-id={id} width={[200]} flexDirection="column" alignItems="center" p={4}>
    <Image src={image} alt={name} />
    <Text>{name}</Text>
  </Flex>
)

export default Organization;