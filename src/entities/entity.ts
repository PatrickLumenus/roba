import { Actions } from './../actions';
import { Resource } from './../resource';
import { GrantSet, GrantType, Permission } from './../permission';
import { Scopable, Scope } from './../scopable';

export abstract class PermissibleEntity implements Scopable {

    readonly name: string;
    protected readonly _permissionMap: Map<string, Permission>;
    readonly scope: string;

    constructor(name: string, permissions: Permission[], scope: string = Scope.Global) {
        this.name = name;
        this._permissionMap= this._buildPermissionsMap(permissions);
        this.scope = scope;
    }

    get permissions(): Permission[] {
        const arr: Array<Permission> = [];
        this._permissionMap.forEach(permission => arr.push(permission));
        return arr;
    }

    private _buildPermissionsMap(permissions: Permission[]): Map<string, Permission> {
        const map = new Map<string, Permission>();
        permissions.forEach(permission => {
            map.set(permission.name, permission);
        });
        return map;
    }

    public abstract can(action: Actions, resource: Resource): boolean;

    public cannot(action: Actions, resource: Resource): boolean {
        return !this.can(action, resource);
    }

    /**
     * getGrantTypeForAction()
     * 
     * gets the corresponding grant type for the action.
     * @param action the cation
     * @param grants the grant set.
     * @returns the grant type for the action.
     */

    protected getGrantTypeForAction(action: Actions, grants: GrantSet): GrantType {
        let type: GrantType;

        switch(action) {
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
}