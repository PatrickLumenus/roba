import { Actions } from '../actions';
import { Permission } from '../permission';
import { Resource } from '../resource';
import { Scope } from '../scopable';
import { PermissibleEntity } from './entity';
import { Collective } from './collective';


export class Actor extends PermissibleEntity {

    readonly id: string;

    constructor(name: string, id: string, permissions: Permission[], scope: string = Scope.Global) {
        super(name, permissions, scope);
        this.id = id;
    }

    public static DerivedFrom(collective: Collective, id: string): Actor {
        return new Actor(collective.name, id, collective.permissions, collective.scope);
    }

    public can(action: Actions, resource: Resource): boolean {
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

            if (resource.isInstance) {
                switch(type) {
                    case 'own':
                        hasPermission = this.id === resource.id;
                        break;
                    case 'any':
                        hasPermission = true;
                        break;
                    default:
                        hasPermission = false;
                };
            }
            else {
                hasPermission = type === 'any';
            }

            // make sure we have the same scope.
            const hasScope = this.scope === Scope.Global || (this.scope === resource.scope);
            permitted = hasScope && hasPermission;
        }

        return permitted;
    }
}