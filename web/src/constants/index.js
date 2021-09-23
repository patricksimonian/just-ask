import config from '../config';

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

export const LOGIN_LINK = `https://github.com/login/oauth/authorize?client_id=${config.CLIENT_ID}&redirect_uri=${window.location.origin}/auth&callback_url=${window.location.origin}`