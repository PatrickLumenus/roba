import { Actions } from "../actions";
import {
  Permission,
  PermissionsBlacklist,
  PermissionsList,
  PermissionsWhitelist,
} from "../permission";
import { Scope } from "../scopable";
import { PermissibleEntity, WhenFn } from "./entity";
import { Collective } from "./collective";

/**
 * Actor
 *
 * An individual entity that is able perform actions.
 */

export class Actor extends PermissibleEntity {
  readonly id: string;
  private readonly whitelist: PermissionsWhitelist;
  private readonly blacklist: PermissionsBlacklist;

  constructor(
    name: string,
    id: string,
    permissions: Permission[],
    scope: string = Scope.Global,
  ) {
    super(name, permissions, scope);
    this.id = id;
    const grants = this.buildPermissionsMap(this.permissions);
    this.whitelist = new PermissionsWhitelist(
      this.name,
      grants,
      this.id,
      this.scope,
    );
    this.blacklist = new PermissionsBlacklist(
      this.name,
      grants,
      this.id,
      this.scope,
    );
  }

  public static DerivedFrom(collective: Collective, id: string): Actor {
    return new Actor(
      collective.name,
      id,
      collective.permissions,
      collective.scope,
    );
  }

  public get can(): PermissionsList {
    return this.whitelist;
  }

  public get cannot(): PermissionsList {
    return this.blacklist;
  }

  public equals(suspect: any): boolean {
    let isEqual = false;

    if (suspect instanceof Actor) {
      const other = suspect as Actor;
      isEqual = super.equals(suspect) && this.id === other.id;
    }

    return isEqual;
  }

  public serialize(): string {
    return JSON.stringify({
      name: this.name,
      scope: this.scope,
      id: this.id,
      permissions: this.serializePermissions(),
    });
  }
}
