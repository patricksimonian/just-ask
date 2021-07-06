import React from 'react';
import WithRole from '../components/WithRole';
import { ROLES } from '../constants';
import Approvals from "./Approvals";
import Requests from "./Requests";
import { Link } from '@reach/router';
const ApprovalRequestManager = () => {
  return (
  <React.Fragment>
    <Link to="/audits">Audits</Link>
    <WithRole roles={[ROLES.APPROVER, ROLES.COLLABORATOR, ROLES.REQUESTER, ROLES.AUDITOR]}>
      <Requests />
    </WithRole>
    <WithRole roles={[ROLES.APPROVER]}>
      <Approvals />
    </WithRole>
  </React.Fragment>
)
}

export default ApprovalRequestManager;