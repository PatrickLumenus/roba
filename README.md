# roba
Flexible Role-Based Access Control

Roba is a lightweight access control library that lets you quickly define and verify rules for controlling access to resources.

## What Does "Roba" Mean?
Roba just uncreatively means **Ro**le-**B**ased **A**ccess. Clever, right?

# Installation
```
npm install roba

or

yarn add roba

or

pnpm add roba
```

# Concepts
## Entities
`Entities` are the actors performing actions, such as users. There are two types of entities: `Actors` and `Collectives`. An `Actor` is a single entity designated by a unique name. Likewise, a `Collective` is a group of several actors under a certain name (such as a role).

### Entity Scopes
`Scopes` are used to group things together.

## Actions
`Actions` are the actions that can be performed. There are only four types of actions: Create, Read, Update, Delete.

## Resources
`Resources` are the things we entities perform actions on. For example, posts. Like Entities, resources are identified by some unique name. `Resources` can either be collections or instances. `Collections` refer to the resource as a whole. Meanwhile, `Instances` are specific objects within a resource collection, identified by an id and owner identifier.

### Scoped Resources
Like entities, resources can also have a scope.


# Usage

## Creating an Entity
To begin, you define an actor or a collective containing its own set of permissions.

```ts
import { Actor, Collective, Permission } from 'roba';

// basic definition of a collective
const users = new Collective('users', [Permissions.Protected('accounts'), ...]);

// with a custom scope for a collective.
const users = new Collective('users', [Permission.Protected('accounts'), ...], 'my-scope');

// creating an actor from a collective.
const user = Actor.DerivedFrom(users, 'bob');

// creating an Actor manually
const user = new Actor('users', 'user-id', [Permission.Protected('accounts'), ...], 'my-scope');
```
An `Actor` is a single entity capable of performing an action. A `Collective` is a collection of `Actor`s under a shared name, scope, and permissions. It is highly recommended that you create a `Collective` first, and then derive `Actor`s from it using the `Actor.DeriveFrom()` method. This ensures actors have a consistent set of permissions and scopes.

## Creating Resounces
Once you have created an entity, you must next create a `Resource`. A `Resource` is something that is owned by an entity. A `Resource` can either be a Collection or an Instance. a Resource Collection refers to all instances of that resource. Meanwhile, a Resource Instance refers to a single instance of that resource with a unique identifier.
```ts
import { Resource } from 'roba';

const accounts = Resource.Collection('accounts', 'my-scope');
const account = Resource.InstanceOf(accounts, 'account-id', user, 'my-scope');
```
We define Resources with either the `Resource.Collection()` method or the `Resource.InstanceOf()` method.

**Note**: Resource names should be single words in lowercase plural form if possible. For example, "accounts" and "users", If more than one word is needed, use underscores (`_`) to separate them. For example, "user_accounts".

## Verifying Permissions
Finally, we can check whether or not an actor or collection can perform an action as follows.
```ts
import { users } from './entities';
import { accounts } from './resources';

users.can.update(accounts); // false
const bob = Actor.DeriveFrom(users, 'bob');
const bobAccount = Resource.InstanceOf(accounts, 'account-id', bob);
bob.can.update(bobAccount); // true
```
Notice how the first call to the `can()` method returns `false` while the second returns `true`. When we pass a Resource Collection to the `can.*()` functions, we are testing permissions for the collection as a whole. When we pass a Resource Instance to the `can.*()` methods, we are testing permissions for that specific resource instance.

### Custom Conditions
There are situations where it is necessary to meet certain conditions, in addition to having the right permissions. For this reason, it is possible to declare custom conditions that must be met in order to grant permission.
```ts
import { Actions } from 'roba';
import { users } from './entities';
import { accounts } from './resources';

users.can.update(accounts); // false
const bob = Actor.DeriveFrom(users, 'bob');
const bobAccount = Resource.InstanceOf(accounts, 'account-id', bob);
bob.can.update(bobAccount, (entity, action, resource) => bobIsActive); // true
```
We have added an additional parater to the `can.*()` methods, which returns a boolean (`bobIsActive`) that indicates whether or not we can update the `bobAccount` resource.

## Verifying the Lack of Permissions
If you need to check if an entity **does not** have permission to perform an action, Roba provides convenient `cannot.*()` methods that return the inverse of their `can.*()` counterparts.
```ts
import { users } from './entities';
import { accounts } from './resources';

users.cannot.update(accounts); // true
const bob = Actor.DeriveFrom(users, 'bob');
const bobAccount = Resource.InstanceOf(accounts, 'account-id', bob);
bob.cannot.update(bobAccount); // false
```

## Inheritance
We can `inherit` from existing collectives using the `Collective.Inheritfrom()` method. Inheriting from a Collective lets the derived collective adopt the permissions and scope of the collective it is inheriting. You can even customize permissions by redefining them in the permissions array, in which case they will override any existing permissions inside the parent collective.

```ts
import { Actions, Collective } from 'roba';
import { users } from './entities';
import { accounts } from './resources';

const admins = Collective.InheritFrom(users, 'admins', [Permission.All('accounts')]);
users.can(Actions.Destroy, accounts) // false
admins.can(Action.Destroy, accounts) // true
```

## Utilities
Roba provides a few utility functions to assist with miscellaneous tasks.

### Parsing Permissions Lists
There are situations where it is necessary to extract permissions from an entity. By default, Roba entities (Actors amd Collectives) expose a `permissionsList` property which returns a string array consisting of the entity's permissions.
```ts
import { Actor, Collective, Permission } from 'roba';

// basic definition of a collective
const users = new Collective('users', [Permissions.Protected('accounts'), ...]);
collectionPermissions = users.permissionsList);

// creating an actor from a collective.
const user = Actor.DerivedFrom(users, 'bob');
const userPermissions = user.permissionsList);
```
To reconstruct permission objects from permissions lists, Roba exports the `parsePermissionsList()` function.
```ts
import { parsePermissionsList } from 'roba';
const permissions = parsePermissionsList(str);
```
The `parsePewrmissionsList()` function returns a `Permission` array which can be used when recreating entities.

# LICENSE
Roba is provided under the [MIT](./LICENSE) license.

# Reporting Issues
If you encounter any issues, you can open an issue [here](https://github.com/PatrickLumenus/roba/issues).
