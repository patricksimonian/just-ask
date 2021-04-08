import nock from "nock";
import accessToken from "../fixtures/accessToken";
import installations from "../fixtures/installations";
import orgTeamMembership from "../fixtures/orgTeamMembership";
import { getConfig } from "../utils/config";
import { getAuthenticatedApps } from "../utils/init";
import { getTeamMembershipForOrg } from "../utils/roles";

jest.mock('../utils/config.js');
const orgs = installations.filter(installation => installation.target_type === 'Organization');

describe('Role utilities tests', () => {
  afterEach(() => {
    nock.cleanAll();
  })
  describe('getOrgRoleForUser', () => {

  });
  
  describe('getTeamMembershipForOrg', () => {
    it('throws if the team membership org is not a valid installation', async () => {
      jest.unmock('../utils/init');
      nock('https://api.github.com').get('/app/installations')
      .reply(200, installations)

      getConfig.mockReturnValueOnce(({orgs: orgs.map(o => o.account.login)}));
      await expect(getTeamMembershipForOrg('foo', 'bar', 'team')).rejects.toThrow('Unable to get org information for foo. The org bar is not a valid installation');
    });
    
    it('returns user if is apart of team', async () => {
      const orgs = installations.filter(installation => installation.target_type === 'Organization');
      
      getConfig.mockReturnValueOnce(({orgs: orgs.map(o => o.account.login)}));
      nock('https://api.github.com').get('/app/installations')
      .reply(200, installations)
      .post('/app/installations/15321559/access_tokens')
      .reply(201, accessToken)
      .get(`/orgs/${orgs[0].account.login}/teams/team`)
      .reply(200, orgTeamMembership);
      console.log('orgs[0].account.login', orgs[0].account.login);
      const user = await getTeamMembershipForOrg(orgTeamMembership[0].login, orgs[0].account.login, 'team');
      
      expect(user).toBeDefined();
    });
  });

  describe('doesUserHaveRole', () => {

  });

  describe('resolveGithubTeam', () => {

  });

  describe('resolveOrgRole', () => {

  });
});