## Roles

Just Ask utilizes roles to identify particular workflows or actions. 


### Admin

Admin's are allowed every action in the API, for security reasons admins cannot be mapped to an `OrgRole` as there is a likelihood of inadvertantly granting too many people administrator access. Instead the administrator of your github org should create a admin only github team and utilize that as a role mapping. 

### Auditors

Auditors are have access to the audit logs as well as approver workflows. Similar to Admins, `OrgRoles` cannot be used as a mapper to create an auditor role. 

### Approvers

Approvers can invite users as well as accept pending invitation requests from `Requesters`

### Collaborators

Collaborators can invite users into the orgs

### Requesters

Requesters can request access for themselves but this is not auto approved, it requires someone with APPROVAL priviledges to accept the invite.