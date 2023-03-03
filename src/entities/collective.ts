import { Actions } from '../actions';
import { Permission } from '../permission';
import { Resource } from '../resource';
import { Scope } from '../scopable';
import { PermissibleEntity } from './entity';


export class Collective extends PermissibleEntity {

    constructor(name: string, permissions: Permission[], scope: string = Scope.Global) {
        super(name, permissions, scope);
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
                // its an instance.
                hasPermission = (type === 'any') || (type === 'own');
            }

            // make sure we have the appropriate scopes
            const hasScope = this.scope === Scope.Global || (this.scope === resource.scope);

            permitted = hasScope && hasPermission;
        }

        return permitted;
    }

    public extend(name: string, permissions: Permission[]): Collective {
        const newPerms = [...this.permissions, ...permissions];
        return new Collective(name, permissions, this.scope);
    }
}