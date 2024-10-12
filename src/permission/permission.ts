import { Equatable, Serializable } from "./../utilities";
import { Resource, ResourceInstance } from "../resource";
import { GrantSet, GrantType } from "./grant-set";
import { createScopeString } from "./utils";
import { Actions } from "../actions";
import { WhenFn } from "../common";
import { Scope } from "../scopable";

/**
 * Permission
 *
 * A single Permission.
 */

export class Permission implements Equatable, Serializable {
  readonly name: string;
  readonly grants: GrantSet;

  constructor(name: string, grants: GrantSet) {
    this.name = name.trim();
    this.grants = grants;
  }

  /**
   * All()
   *
   * Creates a Permission instance that grants access to all actions for the named resource.
   * @param resource The resource the permission applies to.
   * @returns the created permission.
   */

  public static All(resource: Resource): Permission {
    return new Permission(resource.name, GrantSet.All());
  }

  /**
   * None()
   *
   * Creates a Permission instance that grants no actions to the named resource.
   * @param resource the resource the permission applies.
   * @returns the created permission
   */

  public static None(resource: Resource): Permission {
    return new Permission(resource.name, GrantSet.None());
  }

  /**
   * Private()
   *
   * creates a Permission instance that only allows the resource owner to access or modify the resource.
   * @param resource the resource the permission applies to.
   * @returns the created resource.
   */

  public static Private(resource: Resource): Permission {
    return new Permission(resource.name, GrantSet.Private());
  }

  /**
   * Protected()
   *
   * Creates a Permission instance where anyone can create and view. However, only the owner of the resource can update and delete.
   * @param resource the resource the permission applies to.
   * @returns The created instance.
   */

  public static Protected(resource: Resource): Permission {
    return new Permission(resource.name, GrantSet.Protected());
  }

  /**
   * Public()
   *
   * Creates a Permission where everything is permitted except destruction.
   * @param resource The resource the permission applies to.
   * @returns The created instance.
   */

  public static Public(resource: Resource): Permission {
    return new Permission(resource.name, GrantSet.Public());
  }

  /**
   * ReadOnly()
   *
   * Creates a Permission where the read action is the only allowed action.
   * @param resource the resource the permission applies to.
   * @returns the created instance.
   */

  public static ReadOnly(resource: Resource): Permission {
    return new Permission(resource.name, GrantSet.ViewOnly());
  }

  public equals(suspect: any): boolean {
    let isEqual = false;

    if (suspect instanceof Permission) {
      const other = suspect as Permission;
      isEqual = this.name === other.name && this.grants.equals(other.grants);
    }

    return isEqual;
  }

  public serialize(): string {
    return this.toPermissionsList().join(" ");
  }

  public toString(): string {
    return this.serialize();
  }

  public toPermissionsList(): string[] {
    return [
      createScopeString(this.name, Actions.Create, this.grants.create),
      createScopeString(this.name, Actions.Read, this.grants.read),
      createScopeString(this.name, Actions.Update, this.grants.update),
      createScopeString(this.name, Actions.Delete, this.grants.delete),
    ];
  }
}

/**
 * PermissionsList
 *
 * A permissions list.
 */

export abstract class PermissionsList {
  constructor(
    readonly subject: string,
    protected readonly permissions: Map<string, GrantSet>,
    readonly scope: string,
    readonly identifier: string,
  ) {}

  /**
   * create()
   *
   * determines if the create action can be peformed on a resource.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public abstract create(resource: Resource, when?: WhenFn): boolean;

  /**
   * read()
   *
   * determines if the read action can be perormed on a resource.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public abstract read(resource: Resource, when?: WhenFn): boolean;

  /**
   * update()
   *
   * determines if the update action can be performed on a resource.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public abstract update(resource: Resource, when?: WhenFn): boolean;

  /**
   * delete()
   *
   * determines if the delete action can be performed on a resource.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public abstract delete(resource: Resource, when?: WhenFn): boolean;
}

/**
 * PermissionsWhiteList
 *
 * A permissions list that defines situations when actions are permissible.
 */

export class PermissionsWhitelist extends PermissionsList {
  constructor(
    subject: string,
    permissioins: Map<string, GrantSet>,
    identifier: string = "",
    scope: string = Scope.Global,
  ) {
    super(subject, permissioins, scope, identifier);
  }

  private isPermissible(
    resource: Resource,
    grant?: GrantType,
    identifier?: string,
  ): boolean {
    let result = false;

    if (grant) {
      switch (grant) {
        case "own":
          result =
            resource instanceof ResourceInstance
              ? this.identifier === resource.owner
              : false;
          break;
        case "any":
          result = true;
          break;
        default:
          result = false;
      }
    }

    return result;
  }

  private hasMatchingResourceScope(resource: Resource): boolean {
    return this.scope === Scope.Global || this.scope === resource.scope;
  }

  public create(resource: Resource, when: WhenFn = () => true): boolean {
    const permission = this.permissions.get(resource.name);
    return (
      this.isPermissible(resource, permission?.create, this.identifier) &&
      this.hasMatchingResourceScope(resource) &&
      when(
        { identifier: this.identifier, name: this.subject, scope: this.scope },
        Actions.Create,
        resource,
      )
    );
  }

  public read(resource: Resource, when: WhenFn = () => true): boolean {
    const permission = this.permissions.get(resource.name);
    return (
      this.isPermissible(resource, permission?.read, this.identifier) &&
      this.hasMatchingResourceScope(resource) &&
      when(
        { identifier: this.identifier, name: this.subject, scope: this.scope },
        Actions.Read,
        resource,
      )
    );
  }

  public update(resource: Resource, when: WhenFn = () => true): boolean {
    const permission = this.permissions.get(resource.name);
    return (
      this.isPermissible(resource, permission?.update, this.identifier) &&
      this.hasMatchingResourceScope(resource) &&
      when(
        { identifier: this.identifier, name: this.subject, scope: this.scope },
        Actions.Update,
        resource,
      )
    );
  }

  public delete(resource: Resource, when: WhenFn = () => true): boolean {
    const permission = this.permissions.get(resource.name);
    return (
      this.isPermissible(resource, permission?.delete, this.identifier) &&
      this.hasMatchingResourceScope(resource) &&
      when(
        { identifier: this.identifier, name: this.subject, scope: this.scope },
        Actions.Delete,
        resource,
      )
    );
  }
}

/**
 * PermissionsBlackList
 *
 * A permissions list that defines situations when actions are not permissible.
 */

export class PermissionsBlacklist extends PermissionsList {
  constructor(
    subject: string,
    permissioins: Map<string, GrantSet>,
    identifier: string = "",
    scope: string = Scope.Global,
  ) {
    super(subject, permissioins, scope, identifier);
  }

  private isProhibited(
    resource: Resource,
    grant?: GrantType,
    identifier?: string,
  ): boolean {
    let result = false;

    if (grant) {
      switch (grant) {
        case "own":
          result =
            resource instanceof ResourceInstance
              ? resource.owner !== identifier
              : true;
          break;
        case "none":
          result = true;
          break;
        default:
          result = false;
      }
    }

    return result;
  }

  private hasProhibitedScope(resource: Resource): boolean {
    return this.scope !== Scope.Global && this.scope !== resource.scope;
  }

  public create(resource: Resource, when: WhenFn = () => false): boolean {
    const permission = this.permissions.get(resource.name);
    return (
      this.isProhibited(resource, permission?.create, this.identifier) ||
      this.hasProhibitedScope(resource) ||
      when(
        { identifier: this.identifier, name: this.subject, scope: this.scope },
        Actions.Create,
        resource,
      )
    );
  }

  public read(resource: Resource, when: WhenFn = () => false): boolean {
    const permission = this.permissions.get(resource.name);
    return (
      this.isProhibited(resource, permission?.read, this.identifier) ||
      this.hasProhibitedScope(resource) ||
      when(
        { identifier: this.identifier, name: this.subject, scope: this.scope },
        Actions.Read,
        resource,
      )
    );
  }

  public update(resource: Resource, when: WhenFn = () => false): boolean {
    const permission = this.permissions.get(resource.name);
    return (
      this.isProhibited(resource, permission?.update, this.identifier) ||
      this.hasProhibitedScope(resource) ||
      when(
        { identifier: this.identifier, name: this.subject, scope: this.scope },
        Actions.Update,
        resource,
      )
    );
  }

  public delete(resource: Resource, when: WhenFn = () => false): boolean {
    const permission = this.permissions.get(resource.name);
    return (
      this.isProhibited(resource, permission?.delete, this.identifier) ||
      this.hasProhibitedScope(resource) ||
      when(
        { identifier: this.identifier, name: this.subject, scope: this.scope },
        Actions.Delete,
        resource,
      )
    );
  }
}
