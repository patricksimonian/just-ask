---
title: Auditing
nav_order: 3
---
## Auditing

The mongo database contains a collection called `audits`. This collection contains a timestamped record of important events that occur during the runtime of the webserver. 

Currently the only way to investigate this audit trail is via connecting to the database via a `mongo client` and running manual queries. 

## Future Releases

Ideally it would be useful for a new role, `AUDITER` to exist so that this particular user may view/search the audit trail from a front end instead of having to inspect the database directly. 