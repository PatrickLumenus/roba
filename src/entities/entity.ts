import { Equatable, Serializable } from '@chaperone/util';
import { Actions } from './../actions';
import { Resource } from './../resource';
import { GrantSet, GrantType, Permission } from './../permission';
import { Scopable, Scope } from './../scopable';

/**
 * PermissibleEntity
 * 
 * A Permissible Entity
 */

export abstract class PermissibleEntity implements Scopable, Equatable, Serializable {

    readonly name: string;
    protected readonly _permissionMap: Map<string, Permission>;
    readonly scope: string;

    constructor(name: string, permissions: Permission[], scope: string = Scope.Global) {
        this.name = name;
        this._permissionMap= this.buildPermissionsMap(permissions);
        this.scope = scope;
    }

    get permissions(): Permission[] {
        const arr: Array<Permission> = [];
        this._permissionMap.forEach(permission => arr.push(permission));
        return arr;
    }

    /**
     * buildPermissionsMap()
     * @param permissions the array of permissions to build the map from
     * @returns The created Permissions Map.
     */

    private buildPermissionsMap(permissions: Permission[]): Map<string, Permission> {
        const map = new Map<string, Permission>();
        permissions.forEach(permission => {
            map.set(permission.name, permission);
        });
        return map;
    }

    /**
     * can()
     * 
     * determines if the entity can perform the action on the resource.
     * @param action the action to be performed.
     * @param resource The resource in which the action will be performed on.
     * @returns TRUE if the entity can perform the action on the resource. FALSE otherwise.
     */

    public abstract can(action: Actions, resource: Resource): boolean;

    /**
     * cannot()
     * 
     * inverse of can()
     * @param action the action to be performed.
     * @param resource The resource in which the action will be performed on.
     * @returns FALSE if the entity can perform the action on the resource. TRUE otherwise.
     */

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

    public equals(suspect: any): boolean {
        let isEqual = false;

        if (suspect instanceof PermissibleEntity) {
            const other = suspect as PermissibleEntity;
            isEqual = (this.name === other.name) && (this.scope === other.scope);
        }

        return isEqual;
    }

    public serialize(): string {
        return JSON.stringify({
            name: this.name,
            scope: this.scope,
            permissions: this.serializePermissions()
        });
    }

    /**
     * serializePermissions()
     * 
     * serializes the permissions.
     * @returns the serialized permissions
     */

    protected serializePermissions(): string {
        return this.permissions.map(perm => perm.serialize()).join(" ");
    }

    public tostring(): string {
        return this.serialize();
    }
}