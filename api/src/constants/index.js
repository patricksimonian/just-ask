export const ROLES = {
  APPROVER: 'APPROVER',
  COLLABORATOR: 'COLLABORATOR',
  REQUESTER: 'REQUESTER',
}

export const ROLE_PRESCEDENT = [
  ROLES.APPROVER,
  ROLES.COLLABORATOR,
  ROLES.REQUESTER,
]

export const ROLE_MAPPING_KINDS = {
  OrgRole: 'OrgRole',
  GithubTeam: 'GithubTeam',
}

export const RULES = {
  approvals: 'approvals', // can approve requests
  requests: 'requests', // can make requests for themselves
  invitations: 'invitations', // can invite other users to orgs,
  organizations: 'organizations', // can view organizations
}

export const ROLE_RULES = {
  [ROLES.APPROVER]: [
    RULES.approvals,
    RULES.requests,
    RULES.invitations,
    RULES.organizations,
  ],
  [ROLES.COLLABORATOR]: [
    RULES.requests,
    RULES.invitations,
    RULES.organizations,
  ],
  [ROLES.REQUESTER]: [RULES.requests, RULES.organizations],
  [undefined]: [], // stub role
}

export const INVITATION_REQUEST_STATES = {
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
}

export const AUDIT_ACTIONS = {
  api: {
    organizations: {
      list: 'organizations.list',
    },
    requests: {
      create: 'requests.create',
      update: 'requests.update',
      patch: 'requests.patch',
      list: 'requests.list',
    },
  },
}
