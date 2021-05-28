## oAuth role mapping

The github app utilizes to Roles for the invitation workflow. There are 3 base roles:

- APPROVER: this role allows a user to approve inivation requests that are otherwise no authorized. For example if a user requests themselves into an organization an APPROVER can grant access
- REQUESTER: this is role applied to users granting them access to make requests to orgs.
- COLLABORATOR: this role applies to users who are able to request users access into orgs without APPROVER grants. The COLLABORATOR can only invite users to orgs that they belong too. APPROVERS can invite users to any org the app is installed on


## Role Mappings

Since different github orgs delegate access control in different ways, it is necessary to declartively identify how and what users are allowed to perform on this github app. 
The config `role-mappers.json` can map a list of org level roles as well as github teams.

```json
{
  "APPROVER": [
    {
      "kind": "OrgRole",
      "role": "admin",
      "organization": "bcgov"
    },
    {
      "kind": "GithubTeam",
      "team": "OrgApprovers",
      "organization": "bcgov"
    }
  ],
  "COLLABORATOR": [{
      "kind": "OrgRole",
      "role": "member",
      "organization": "bcgov"
    }],
  "REQUESTER": [null]
}

```

## Other Considerations

Since this app can manage multiple organizations. There is no delineation between this github apps ROLES and specific access to an org. In other words, if a user has `APPROVER` they can approve requests for all organizations this app is installed/configured on.

## Special Cases

`null` values in the first index of the role mapping treat the role mapping as a no-mapping-required. In other words, the role is applied to all users by default. `APPROVER` mappings cannot be `null`.