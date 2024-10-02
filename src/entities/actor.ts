import { Actions } from "../actions";
import { Permission } from "../permission";
import { Resource, ResourceInstance } from "../resource";
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

  constructor(
    name: string,
    id: string,
    permissions: Permission[],
    scope: string = Scope.Global,
  ) {
    super(name, permissions, scope);
    this.id = id;
  }

  public static DerivedFrom(collective: Collective, id: string): Actor {
    return new Actor(
      collective.name,
      id,
      collective.permissions,
      collective.scope,
    );
  }

  /**
   * can()
   *
   * determines if the Actor can perform the action on the resource.
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
    let permitted = this._permissionMap.has(resource.name);

    if (permitted) {
      // We ensure the actor has the permissions to perform the action.
      // There are two situations that can be encountered.
      //
      // The first situation is if the resource is an instance. In this
      // situation, we have to ensure the actor either owns the resource instance
      // or the actor has permission to perform the action on any instance of the
      // resource.
      //
      // The second situation is if the resource is a collection. In this situation,
      // the actor has permision when it has permission to perform the action on any
      // such resource.

      const permissions = this._permissionMap.get(resource.name)!;
      const type = this.getGrantTypeForAction(action, permissions.grants);
      let hasPermission = false;

      if (resource instanceof ResourceInstance) {
        switch (type) {
          case "own":
            hasPermission = this.id === resource.owner;
            break;
          case "any":
            hasPermission = true;
            break;
          default:
            hasPermission = false;
        }
      } else {
        hasPermission = type === "any";
      }

      // make sure we have the same scope.
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
   * determines if the create action can be peformed on a resource.
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
   * determines if the destroy action can be performed on a resource.
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
   * determines if the view action can be perormed on a resource.
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
