# roba
Flexible Role-Based Access Control

# Installation
```
npm install roba

or 

yarn add roba
```

# Concepts
## Entities
`Entities` are the actors performing actions, such as users. There are two types of entities: `Actors` and `Collectives`. An `Actor` is a single entity designated by a unique name. Likewise, a `Collective` is a group of several actors under a certain name (such as a role). 

### Entity Scopes
`Scopes` are used to group things together.

## Actions
`Actions` are the actions that can be performed. There are only four types of actions: Create, Read, Update, Delete.

## Resources
`Resources` are the things we entities perform actions on. For example, posts. Like Entities, resources are identified by some unique name. `Resources` can either be collections or instances. `Collections` refer to the resource as a whole. Meanwhile, `Instances` are specific entry within a resource collectio, identified by an id and owner identifier.

### Scoped Resources
Like entities, resources can also have a scope.


# Usage
```ts
import { Resource, Collective, Actions } from 'roba';

const users = new Collective('users', [
    new Permission('posts', GrantSet.None()), // No permissions
    new Permission('profile', GrantSet.Protected()), // everyone can read and create. Only owners can edit and delete.
    new Permission('bullitin', new GrantSet(create: 'any', read: 'own', update: 'none', delete: 'own')) // custom
]);

const posts = Resource.Collection('posts');

users.can(Actions.Create, posts); // false
users.cannot(actions.Read, posts) // true.
```

```ts
import { Action, Actor, Resource } from 'roba';

const user = new Actor('users', 'user-id', [
    new Permission('posts', GrantSet.None()), // No permissions
    new Permission('profile', GrantSet.Protected()), // everyone can read and create. Only owners can edit and delete.
    new Permission('bullitin', new GrantSet(create: 'any', read: 'own', update: 'none', delete: 'own')) // custom
]);
const anotherUser = new Actor('users', 'another-user-id', ...);
const profile = Resource.Instance('profiles', 'entry-id', 'user-id');
user.can(Actions.Update, profile); // true
anotherUser.can(Actions.Update, profile); // false
```

```ts
import { Resource, Actions } from 'roba';
import { users } from './users-collective';

const administrator = users.inherit(users, overridePerms);
const profle = Resource.Instance('profile', 'entry-id', 'user-id');
administrator.can(Actions.Delete, profile); // true
```