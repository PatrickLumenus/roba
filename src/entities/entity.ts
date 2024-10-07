import { Equatable, Serializable } from "./../utilities";
import { Actions } from "./../actions";
import { Resource } from "./../resource";
import { GrantSet, Permission, PermissionsList } from "./../permission";
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
  // protected readonly _permissionMap: Map<string, Permission>;
  readonly scope: string;
  readonly permissions: Permission[];

  constructor(
    name: string,
    permissions: Permission[],
    scope: string = Scope.Global,
  ) {
    this.name = name;
    this.permissions = permissions;
    // this._permissionMap = this.buildPermissionsMap(permissions);
    this.scope = scope.trim();
  }

  // get permissions(): Permission[] {
  //   const arr: Array<Permission> = [];
  //   this._permissionMap.forEach((permission) => arr.push(permission));
  //   return arr;
  // }

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

  protected buildPermissionsMap(
    permissions: Permission[],
  ): Map<string, GrantSet> {
    const map = new Map<string, GrantSet>();
    permissions.forEach((permission) => {
      map.set(permission.name, permission.grants);
    });
    return map;
  }

  /**
   * can
   *
   * An object containing a list of permissions to verify against to determine if an actiion is permitted.
   */

  public abstract get can(): PermissionsList;

  /**
   * cannot
   *
   * An object containing a list of permissions to verify against to determine if an actiion is not permitted.
   */

  public abstract get cannot(): PermissionsList;

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
