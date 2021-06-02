import { Text } from "rebass"
import { WidthControlledContainer } from "./Containers"



const Shpeel = () => (
  <WidthControlledContainer>
    <Text as="h1" fontWeight={400} textAlign="center" mb={10}>Just Ask!</Text>
    <Text as="h2" fontWeight={400} fontSize={[5,4,5]} mb={3} maxWidth={1200}>
      <Text as="em" color="secondary" fontStyle="normal">Just Ask!</Text> is a Github App designed to provide a self-service workflow 
      for gaining membership into a set of github orgs. 
    </Text>
    <Text as="p" mb={8} maxWidth={1200}>
      If you are a large organization, managing a provision/approval process to get users into your org is toil. More than that, it is also 
      a barrier to people who are interested in your orgs work and want to contribute. 
    </Text>
    <Text as="h2" fontWeight={400} fontSize={[5,4,5]} mb={3} maxWidth={1200}>Github Org Management can be painful</Text>
    <Text as="p" mb={8} maxWidth={1200}> The role-based access structure of github is basic. It doesn't provide a means of granting certain users access to administering invite membership without giving the keys to castle.
    </Text>
    
    <Text as="h2" fontWeight={400} fontSize={[5,4,5]} mb={3} maxWidth={1200}><Text as="em" color="secondary" fontStyle="normal">Just Ask!</Text> extends the basic role based access of your github orgs</Text>
    <Text as="p" mb={8} maxWidth={1200}>
      With the three membership request workflows (Approvals, Requesters, Collaborators), users have a self-serve path to
      gaining access to your organizations. Requests are backed by an audit trail to keep track of access incidents.
    </Text>

    <Text  as="h2" fontWeight={400} fontSize={[5,4,5]} mb={3} maxWidth={1200}>It's as easy as <Text as="em" color="secondary" fontStyle="normal">Just Asking!</Text></Text>
    <Text as="p" mb={8} maxWidth={1200}>
      Make a request for yourself or someone else. Based on your rbac, your requests will be either automatically approved or awaiting approval!
      </Text>

    <Text  as="h2" fontWeight={400} fontSize={[5,4,5]} mb={3} maxWidth={1200}>If there's a<Text as="em" color="red" fontStyle="normal"> problem</Text></Text>
    <Text as="p" mb={8} maxWidth={1200}>
      If you find a problem with Just Ask! Make a <Text as="a" href="https://github.com/patricksimonian/just-ask/issues">Github Issue </Text> so that it can be resolved. Pull requests are also welcome!
    </Text>
  </WidthControlledContainer>
)

export default Shpeel;