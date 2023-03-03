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
     * inherit()
     * 
     * extends an existing collective.
     * @param collective the collective to inherit from
     * @param name the name of the derived collective.
     * @param permissions permissions overrides.
     * @param scope the new scope. If omitted, the collective's scope is inherited.
     * @returns the derived collective.
     */

    public static Inherit(collective: Collective, name: string, permissions: Permission[] = [], scope: string|null = null): Collective {
        const newPerms = [...collective.permissions, ...permissions];
        const newScope = scope !== null ? scope : collective.scope;
        return new Collective(name, newPerms, newScope);
    }

    public can(action: Actions, resource: Resource): boolean {
        let permitted = this._permissionMap.has(resource.name);

        if (permitted) {
            // make sure we have the appropriate permissions.
            let hasPermission: boolean = false;
            const permissions = this._permissionMap.get(resource.name)!;
            const type = this.getGrantTypeForAction(action, permissions.grants);

            if (resource.isCollection) {
                hasPermission = type === 'any';
            }
            else {
                // we cannot grant permissions for an instance of a resource.
                hasPermission = false;
            }

            // make sure we have the appropriate scopes
            const hasScope = this.scope === Scope.Global || (this.scope === resource.scope);
            permitted = hasScope && hasPermission;
        }

        return permitted;
    }
}