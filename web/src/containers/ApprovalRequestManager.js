import React from 'react';
import { Text } from 'rebass';
import { WidthControlledContainer } from '../components/Containers';
import WithRole from '../components/WithRole';
import { ROLES } from '../constants';
import Approvals from "./Approvals";
import Requests from "./Requests";

const ApprovalRequestManager = () => {
  return (
  <React.Fragment>
    <WidthControlledContainer>
      <Text fontSize={4} mb={3}>This Github App is designed to provide a self-service workflow for gaining membership into a github org. Make a request for yourself or someone else. Based on your rbac, your requests will be either automatically approved or awaiting approval. Only authorized users may make or approve requests.</Text>
    </WidthControlledContainer>
    <WithRole roles={[ROLES.APPROVER, ROLES.COLLABORATER, ROLES.REQUESTER, ROLES.AUDITER]}>
      <Requests />
    </WithRole>
    <WithRole roles={[ROLES.APPROVER]}>
      <Approvals />
    </WithRole>
  </React.Fragment>
)
}

export default ApprovalRequestManager;