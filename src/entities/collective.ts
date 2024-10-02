import { Actions } from "../actions";
import { Permission } from "../permission";
import { Resource } from "../resource";
import { Scope } from "../scopable";
import { PermissibleEntity, WhenFn } from "./entity";

/**
 * Collective
 *
 * A group of entities under the same name, and share resources.
 */

export class Collective extends PermissibleEntity {
  constructor(
    name: string,
    permissions: Permission[],
    scope: string = Scope.Global,
  ) {
    super(name, permissions, scope);
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

  /**
   * can()
   *
   * determines if the collective can perform the action on the resource.
   * @param action the action to be performed.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public can(
    action: Actions,
    resource: Resource,
    when: WhenFn = () => true,
  ): boolean {
    // we make sure we have permissions for that resource.
    let permitted = this._permissionMap.has(resource.name);

    if (permitted) {
      // make sure we have the appropriate permissions. For collectives, we have permission if the grant type for the resource is any.
      const permissions = this._permissionMap.get(resource.name)!;
      const hasPermission =
        this.getGrantTypeForAction(action, permissions.grants) === "any";

      // make sure we have the appropriate scopes. We have the appropriate scopes if the scope either matches the scope of the resource or if we have the global scope.
      const hasScope =
        this.scope === Scope.Global || this.scope === resource.scope;
      permitted = hasScope && hasPermission;

      // process additional conditions.
      permitted = permitted && when(this, action, resource);
    }

    return permitted;
  }

  /**
   * canCreate()
   *
   * determines if the create action can can be performed on a resource.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public canCreate(resource: Resource, when: WhenFn = () => true): boolean {
    return this.can(Actions.Create, resource, when);
  }

  /**
   * canDestroy()
   *
   * determines if the  destroy action can be performed on a resource.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public canDestroy(resource: Resource, when: WhenFn = () => true): boolean {
    return this.can(Actions.Destroy, resource, when);
  }

  /**
   * canUpdate()
   *
   * determines if the update action can be performed on a resource.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public canUpdate(resource: Resource, when: WhenFn = () => true): boolean {
    return this.can(Actions.Update, resource, when);
  }

  /**
   * canView()
   *
   * determines if the view action can be performed on a resource.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public canView(resource: Resource, when: WhenFn = () => true): boolean {
    return this.can(Actions.View, resource, when);
  }

  /**
   * cannot()
   *
   * inverse of can()
   * @param action the action to be performed.
   * @param resource The resource in which the action will be performed on.
   * @returns FALSE if the entity can perform the action on the resource. TRUE otherwise.
   */

  public cannot(
    action: Actions,
    resource: Resource,
    when: WhenFn = () => false,
  ): boolean {
    return !this.can(action, resource) || when(this, action, resource);
  }

  /**
   * cannotCreate()
   *
   * determines if the  create action cannot be performed on a resource.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public cannotCreate(resource: Resource, when: WhenFn = () => true): boolean {
    return this.cannot(Actions.Create, resource, when);
  }

  /**
   * cannotDestroy()
   *
   * determines if the destroy action cannot be peformed on a resource.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public cannotDestroy(resource: Resource, when: WhenFn = () => true): boolean {
    return this.cannot(Actions.Destroy, resource, when);
  }

  /**
   * cannotUpdate()
   *
   * determines if the update action cannot be performed on a resource.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public cannotUpdate(resource: Resource, when: WhenFn = () => true): boolean {
    return this.cannot(Actions.Update, resource, when);
  }

  /**
   * cannotView()
   *
   * determines if the view action cannot be performed on a resource.
   * @param resource The resource in which the action will be performed on.
   * @param when An optional function to customize the behavior. the when function returns true if additional
   * requirements to grant permissions is met.
   * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
   */

  public cannotView(resource: Resource, when: WhenFn = () => true): boolean {
    return this.cannot(Actions.View, resource, when);
  }

  public equals(suspect: any): boolean {
    if (suspect instanceof Collective) {
      return super.equals(suspect);
    } else {
      return false;
    }
  }
}
