export const ROLES = {
  APPROVER: 'APPROVER',
  COLLABORATER: 'COLLABORATER',
  REQUESTER: 'REQUESTER',
  AUDITER: 'AUDITER'
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
  [ROLES.COLLABORATER]: [RULES.organizations.list, RULES.requests.create],
  [ROLES.REQUESTER]: [RULES.organizations.list],
}

export const GITHUB_API_URL = 'https://api.github.com';