import React from 'react';
import Approvals from "./Approvals";
import Requests from "./Requests";

const ApprovalRequestManager = () => (
  <React.Fragment>
    <Requests />
    <Approvals />
  </React.Fragment>
)

export default ApprovalRequestManager;