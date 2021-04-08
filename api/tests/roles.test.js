import nock from "nock";
import accessToken from "../fixtures/accessToken";
import installations from "../fixtures/installations";
import orgMembership from "../fixtures/orgMembership";
import orgTeamMembership from "../fixtures/orgTeamMembership";
import { getConfig } from "../utils/config";
import { getOrgRoleForUser, getTeamMembershipForOrg, resolveGithubTeam, resolveOrgRole } from "../utils/roles";

jest.mock('../utils/config.js');
const orgs = installations.filter(installation => installation.target_type === 'Organization');

describe('Role utilities tests', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('getOrgRoleForUser', () => {
    it('throws if the team membership org is not a valid installation', async () => {
      jest.unmock('../utils/init');
      nock('https://api.github.com').get('/app/installations')
      .reply(200, installations)

      getConfig.mockReturnValueOnce(({orgs: orgs.map(o => o.account.login)}));
      await expect(getOrgRoleForUser('foo', 'bar')).rejects.toThrow('Unable to get org information for foo. The org bar is not a valid installation');
    });

    it('returns role', async () => {
      getConfig.mockReturnValueOnce(({orgs: orgs.map(o => o.account.login)}));
      nock('https://api.github.com').get('/app/installations')
      .reply(200, installations)
      .post('/app/installations/15321559/access_tokens')
      .reply(201, accessToken)
      .get(`/orgs/${orgs[0].account.login}/memberships/${orgMembership.user.login}`)
      .reply(200, orgMembership);

      const role = await getOrgRoleForUser(orgMembership.user.login, orgs[0].account.login);

      expect(role).toBe(orgMembership.role);
    });
  });
  
  describe('getTeamMembershipForOrg', () => {
    it('throws if the team membership org is not a valid installation', async () => {
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

      const user = await getTeamMembershipForOrg(orgTeamMembership[0].login, orgs[0].account.login, 'team');
      
      expect(user).toBeDefined();
    });
  });

  describe('doesUserHaveRole', () => {

  });

  describe('resolveGithubTeam', () => {
    it('returns false if org is not a valid installation', async () => {
      nock('https://api.github.com').get('/app/installations')
      .reply(200, installations)

      getConfig.mockReturnValueOnce(({orgs: orgs.map(o => o.account.login)}));
      await expect(resolveGithubTeam('foo', 'mattdamon', 'team')).resolves.toBe(false);
    });

    it('returns true if user is found', async () => {
      getConfig.mockReturnValueOnce(({orgs: orgs.map(o => o.account.login)}));
      nock('https://api.github.com').get('/app/installations')
      .reply(200, installations)
      .post('/app/installations/15321559/access_tokens')
      .reply(201, accessToken)
      .get(`/orgs/${orgs[0].account.login}/teams/team`)
      .reply(200, orgTeamMembership);

      await expect(resolveGithubTeam(orgTeamMembership[0].login, orgs[0].account.login, 'team')).resolves.toBe(true);
    });
  });

  describe('resolveOrgRole', () => {
    it('returns false if org is not a valid installation', async () => {
      nock('https://api.github.com').get('/app/installations')
      .reply(200, installations)

      getConfig.mockReturnValueOnce(({orgs: orgs.map(o => o.account.login)}));
      await expect(resolveOrgRole('foo', 'mattdamon', 'admin')).resolves.toBe(false);
    });

    it('returns true if user is found', async () => {
      getConfig.mockReturnValueOnce(({orgs: orgs.map(o => o.account.login)}));
      nock('https://api.github.com').get('/app/installations')
      .reply(200, installations)
      .post('/app/installations/15321559/access_tokens')
      .reply(201, accessToken)
      .get(`/orgs/${orgs[0].account.login}/memberships/${orgMembership.user.login}`)
      .reply(200, orgMembership);

      await expect(resolveOrgRole(orgMembership.user.login, orgs[0].account.login, orgMembership.role)).resolves.toBe(true);
    });
  });
});