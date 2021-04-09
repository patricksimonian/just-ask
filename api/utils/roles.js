import log from "log";
import { ROLES, ROLE_MAPPING_KINDS } from "../constants";
import { getRoleMapping } from "./config";
import { getAuthenticatedApps } from "./init"


/**
 * checks a user against an org role and returns boolean if they meet the spec
 * @param {String} username valid github user
 * @param {String} role valid github org role (member/owner)
 * @param {String} org github org name
 * @returns {Promise<Boolean>}
 */
export const resolveOrgRole = async (username, org, role) => {
  try {
    const orgMembershipRole = await getOrgRoleForUser(username, org);

    return role === orgMembershipRole;
  } catch(e) {

    log.error(e.message);
    return false;
  }   
}


/**
 * checks if user is apart of specific org team
 * @param {String} username the user
 * @param {String} org the org name
 * @param {String} team the github team
 * @returns {Promise<Boolean>}
 */
export const resolveGithubTeam = async (username, org, team) => {
  try {
    const user = await getTeamMembershipForOrg(username, org, team);

    return !!user;
  } catch(e) {

    log.error(e);
    return false;
  }
}


/**
 * checks if user has a app role
 * @param {String} role the app role as defined in constants.ROLE_MAPPING_KINDS 
 * @param {String} username the github user
 * @returns {Promise<Boolean>}
 */
export const doesUserHaveRole = async (role, username) => {
  const mappings = getRoleMapping();
  
  // special case where you can grant access to role if configured to not look for anything special
  if(role !== ROLES.APPROVER && mappings[role][0] === null) return true;

  const checks = await Promise.all(mappings[role].map(async mapper => {

    switch(mapper.kind) {

      case ROLE_MAPPING_KINDS.OrgRole:
        return resolveOrgRole(username, mapper.organization, mapper.role);

      case ROLE_MAPPING_KINDS.GithubTeam:
        return resolveGithubTeam(username, mapper.organization, mapper.team);

      default:
        return false;
    }

  }));

  return checks.includes(true);
}

/**
 * attempts to get user from an org team
 * @param {String} username 
 * @param {String} org 
 * @param {String} team 
 * @returns {Promise<GithubUser>}
 */
export const getTeamMembershipForOrg = async (username, org, team) => {
  const installations = await getAuthenticatedApps();

  if(!installations.apps[org]) {
    const message = `Unable to get org information for ${username}. The org ${org} is not a valid installation`;
    log.warn(message);
    throw new Error(message);
  }

  const installation = installations.apps[org];

  const response = await installation.authenticatedRequest('GET /orgs/{org}/teams/{team}', {
    org,
    team
  });

  return response.data.find(member => member.login === username);
}


/**
 * get org role for user
 * @param {String} username 
 * @param {String} org 
 * @returns {Promise<String>}
 */
export const getOrgRoleForUser = async (username, org) => {
  const installations = await getAuthenticatedApps();
  const installation = installations.apps[org];

  if(!installation) {
    const message = `Unable to get org information for ${username}. The org ${org} is not a valid installation`;
    log.warn(message);
    throw new Error(message);
  }

  // make request for org membership
  const response = await installation.authenticatedRequest('GET /orgs/{org}/memberships/{username}', {
    org,
    username
  });

  return response.data.role;
}