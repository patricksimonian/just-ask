export default {
  APPROVER: [
    {
      kind: "OrgRole",
      role: "admin",
      organization: "patrick-org-test",
    },
    {
      kind: "GithubTeam",
      team: "OrgApprovers",
      organization: "patrick-org-test",
    },
  ],
  REQUESTER: [null],
  COLLABORATOR: [
    {
      kind: "OrgRole",
      role: "member",
      organization: "patrick-org-test",
    },
  ],
};
