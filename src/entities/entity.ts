import { Equatable, Serializable } from "./../utilities";
import { Actions } from "./../actions";
import { Resource } from "./../resource";
import { GrantSet, GrantType, Permission } from "./../permission";
import { Scopable, Scope } from "./../scopable";

/**
 * WhenFn
 *
 * A function to determine additional conditions for granting permission.
 */

export type WhenFn = (
  entity: PermissibleEntity,
  action: Actions,
  resource: Resource,
) => boolean;

/**
 * PermissibleEntity
 *
 * A Permissible Entity
 */

export abstract class PermissibleEntity
  implements Scopable, Equatable, Serializable
{
  readonly name: string;
  protected readonly _permissionMap: Map<string, Permission>;
  readonly scope: string;

  constructor(
    name: string,
    permissions: Permission[],
    scope: string = Scope.Global,
  ) {
    this.name = name;
    this._permissionMap = this.buildPermissionsMap(permissions);
    this.scope = scope;
  }

  get permissions(): Permission[] {
    const arr: Array<Permission> = [];
    this._permissionMap.forEach((permission) => arr.push(permission));
    return arr;
  }

  get permissionsList(): string[] {
    const scopeList: string[] = [];
    this.permissions.forEach((perm) =>
      scopeList.push(...perm.toPermissionsList()),
    );
    return scopeList;
  }

  /**
   * buildPermissionsMap()
   * @param permissions the array of permissions to build the map from
   * @returns The created Permissions Map.
   */

  private buildPermissionsMap(
    permissions: Permission[],
  ): Map<string, Permission> {
    const map = new Map<string, Permission>();
    permissions.forEach((permission) => {
      map.set(permission.name, permission);
    });
    return map;
  }

  /**
   * can()
   *
   * determines if the entity can perform the action on the resource.
   * @param action the action to be performed.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public abstract can(
    action: Actions,
    resource: Resource,
    when: WhenFn,
  ): boolean;

  /**
   * cannot()
   *
   * inverse of can()
   * @param action the action to be performed.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to deny permissions is met.
   * @returns FALSE if the entity can perform the action on the resource. TRUE otherwise.
   */

  public abstract cannot(
    action: Actions,
    resource: Resource,
    when: WhenFn,
  ): boolean;

  /**
   * getGrantTypeForAction()
   *
   * gets the corresponding grant type for the action.
   * @param action the cation
   * @param grants the grant set.
   * @returns the grant type for the action.
   */

  protected getGrantTypeForAction(
    action: Actions,
    grants: GrantSet,
  ): GrantType {
    let type: GrantType;

    switch (action) {
      case Actions.Create:
        type = grants.create;
        break;
      case Actions.View:
        type = grants.view;
        break;
      case Actions.Update:
        type = grants.update;
        break;
      default:
        type = grants.destroy;
    }

    return type;
  }

  public equals(suspect: any): boolean {
    let isEqual = false;

    if (suspect instanceof PermissibleEntity) {
      const other = suspect as PermissibleEntity;
      isEqual = this.name === other.name && this.scope === other.scope;
    }

    return isEqual;
  }

  public serialize(): string {
    return JSON.stringify({
      name: this.name,
      scope: this.scope,
      permissions: this.serializePermissions(),
    });
  }

  /**
   * serializePermissions()
   *
   * serializes the permissions.
   * @returns the serialized permissions
   */

  protected serializePermissions(): string {
    const strArr = this.permissions.map((perm) => perm.toString());
    return strArr.join(" ");
  }

  public toString(): string {
    return this.serialize();
  }
}
