import { Actions } from '../actions';
import { Permission } from '../permission';
import { Resource } from '../resource';
import { Scope } from '../scopable';
import { PermissibleEntity } from './entity';


export class Collective extends PermissibleEntity {

    constructor(name: string, permissions: Permission[], scope: string = Scope.Global) {
        super(name, permissions, scope);
    }

    /**
     * inheritFrom()
     * 
     * extends an existing collective.
     * @param collective the collective to inherit from
     * @param name the name of the derived collective.
     * @param permissions permissions overrides.
     * @param scope the new scope. If omitted, the collective's scope is inherited.
     * @returns the derived collective.
     */

    public static InheritFrom(collective: Collective, name: string, permissions: Permission[] = [], scope: string|null = null): Collective {
        const newPerms = [...collective.permissions, ...permissions];
        const newScope = scope !== null ? scope : collective.scope;
        return new Collective(name, newPerms, newScope);
    }

    public can(action: Actions, resource: Resource): boolean {
        // we make sure we have permissions for that resource.
        let permitted = this._permissionMap.has(resource.name);

        if (permitted) {
            // make sure we have the appropriate permissions. For collectives, we have permission if the grant type for the resource is any.
            const permissions = this._permissionMap.get(resource.name)!;
            const hasPermission = this.getGrantTypeForAction(action, permissions.grants) === 'any';

            // make sure we have the appropriate scopes. We have the appropriate scopes if the scope either matches the scope of the resource or if we have the global scope.
            const hasScope = this.scope === Scope.Global || (this.scope === resource.scope);
            permitted = hasScope && hasPermission;
        }

        return permitted;
    }
}