export const ROLES = {
  APPROVER: 'APPROVER',
  COLLABORATOR: 'COLLABORATOR',
  REQUESTER: 'REQUESTER',
  ADMINISTRATOR: 'ADMINISTRATOR',
  AUDITOR: 'AUDITOR',
}

export const ROLE_PRESCEDENT = [
  ROLES.ADMINISTRATOR,
  ROLES.AUDITOR,
  ROLES.APPROVER,
  ROLES.COLLABORATOR,
  ROLES.REQUESTER,
]

export const ROLE_MAPPING_KINDS = {
  OrgRole: 'OrgRole',
  GithubTeam: 'GithubTeam',
}

export const ALLOWABLE_ROLE_MAPPINGS = {
  [ROLES.ADMINISTRATOR]: [ROLE_MAPPING_KINDS.GithubTeam],
  [ROLES.AUDITOR]: [ROLE_MAPPING_KINDS.GithubTeam],
  [ROLES.APPROVER]: [ROLE_MAPPING_KINDS.OrgRole, ROLE_MAPPING_KINDS.GithubTeam],
  [ROLES.COLLABORATOR]: [
    ROLE_MAPPING_KINDS.OrgRole,
    ROLE_MAPPING_KINDS.GithubTeam,
  ],
  [ROLES.REQUESTER]: [
    ROLE_MAPPING_KINDS.OrgRole,
    ROLE_MAPPING_KINDS.GithubTeam,
  ],
}

export const RULES = {
  approvals: 'approvals', // can approve requests
  requests: 'requests', // can make requests for themselves
  invitations: 'invitations', // can invite other users to orgs,
  organizations: 'organizations', // can view organizations
  delete_requested: 'delete_requested', //
  view_audits: 'view_audits',
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
  [ROLES.AUDITOR]: [
    RULES.approvals,
    RULES.requests,
    RULES.invitations,
    RULES.organizations,
    RULES.view_audits,
  ],
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
    audits: {
      list: 'audits.list',
    },
    users: {
      invitations: {
        get: 'users.invitations.get'
     },
    },
  },
}
