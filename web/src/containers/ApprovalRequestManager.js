import React from 'react';
import WithRole from '../components/WithRole';
import { ROLES } from '../constants';
import Approvals from "./Approvals";
import Requests from "./Requests";

const ApprovalRequestManager = () => {
  
  return (
  <React.Fragment>
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