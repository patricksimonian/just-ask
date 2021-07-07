export const ROLES = {
  APPROVER: 'APPROVER',
  COLLABORATOR: 'COLLABORATOR',
  REQUESTER: 'REQUESTER',
  AUDITOR: 'AUDITOR'
}

export const RULES = {
  requests: {
    create: 'create',
    patch: 'patch',
    list: 'list',
  },
  organizations: {
    list: 'list'
  },
  approvals: {
    list: 'list'
  }

}

export const ROLE_RULES = {
  [ROLES.APPROVER]: [RULES.organizations.list, RULES.approvals.list, RULES.requests.create, RULES.requests.list, RULES.requests.patch],
  [ROLES.COLLABORATOR]: [RULES.organizations.list, RULES.requests.create],
  [ROLES.REQUESTER]: [RULES.organizations.list],
  [ROLES.AUDITOR]: [RULES.organizations.list, RULES.approvals.list, RULES.requests.create, RULES.requests.list, RULES.requests.patch],
}

export const GITHUB_API_URL = 'https://api.github.com';
