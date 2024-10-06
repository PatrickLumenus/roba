import { Actions } from "../actions";
import {
  Permission,
  PermissionsBlacklist,
  PermissionsList,
  PermissionsWhitelist,
} from "../permission";
import { Resource } from "../resource";
import { Scope } from "../scopable";
import { PermissibleEntity, WhenFn } from "./entity";

/**
 * Collective
 *
 * A group of entities under the same name, and share resources.
 */

export class Collective extends PermissibleEntity {
  private readonly whitelist: PermissionsWhitelist;
  private readonly blacklist: PermissionsBlacklist;

  constructor(
    name: string,
    permissions: Permission[],
    scope: string = Scope.Global,
  ) {
    super(name, permissions, scope);
    const grants = this.buildPermissionsMap(this.permissions);
    this.whitelist = new PermissionsWhitelist(
      this.name,
      grants,
      "",
      this.scope,
    );
    this.blacklist = new PermissionsBlacklist(
      this.name,
      grants,
      "",
      this.scope,
    );
  }

  /**
   * InheritFrom()
   *
   * extends an existing collective.
   * @param collective the collective to inherit from
   * @param name the name of the derived collective.
   * @param permissions permissions overrides.
   * @param scope the new scope. If omitted, the collective's scope is inherited.
   * @returns the derived collective.
   */

  public static InheritFrom(
    collective: Collective,
    name: string,
    permissions: Permission[] = [],
    scope: string | null = null,
  ): Collective {
    const newPerms = [...collective.permissions, ...permissions];
    const newScope = scope !== null ? scope : collective.scope;
    return new Collective(name, newPerms, newScope);
  }

  public get can(): PermissionsList {
    return this.whitelist;
  }

  public get cannot(): PermissionsList {
    return this.blacklist;
  }

  public equals(suspect: any): boolean {
    if (suspect instanceof Collective) {
      return super.equals(suspect);
    } else {
      return false;
    }
  }
}
