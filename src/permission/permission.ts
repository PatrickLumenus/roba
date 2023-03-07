
import { Equatable, Serializable } from '@chaperone/util';
import { GrantSet } from './grant-set';

/**
 * Permission
 * 
 * A single Permission.
 */

export class Permission implements Equatable, Serializable {

    readonly name: string;
    readonly grants: GrantSet;

    constructor(name: string, grants: GrantSet) {
        this.name = name.trim()
        this.grants = grants;
    }

    /**
     * All()
     * 
     * Creates a Permission instance that grants access to all actions for the resource name.
     * @param name the name of the resource the permission partains to.
     * @returns the created permission.
     */

    public static All(name: string): Permission {
        return new Permission(name, GrantSet.All());
    }

    /**
     * None()
     * 
     * Creates a Permission instance that grants no actions to the named resource.
     * @param name the name of the resource the permission applies to.
     * @returns the created permission
     */

    public static None(name: string): Permission {
        return new Permission(name, GrantSet.None());
    }

    /**
     * Private()
     * 
     * creates a Permission instance that onlt allows the resource owner to access or modify the resource.
     * @param name the name of the resource the permission partains to.
     * @returns the created resource. 
     */

    public static Private(name: string): Permission {
        return new Permission(name, GrantSet.Private());
    }

    /**
     * Protected()
     * 
     * Creates a Permission instance where anyone can create and view. However, only the owner of the resource can update and delete.
     * @param name the name of the resource the permission partains to.
     * @returns The created instance.
     */

    public static Protected(name: string): Permission {
        return new Permission(name, GrantSet.Protected());
    }

    public equals(suspect: any): boolean {
        let isEqual = false;

        if (suspect instanceof Permission) {
            const other = suspect as Permission;
            isEqual = (
                (this.name === other.name) &&
                this.grants.equals(other.grants)
            );
        }

        return isEqual;
    }

    public serialize(): string {
        return `${this.name}-create-${this.grants.create.toString()} ${this.name}-read-${this.grants.view.toString()} ${this.name}-update-${this.grants.update.toString()} ${this.name}-destroy-${this.grants.destroy.toString()}`;
    }

    public toString(): string {
        return this.serialize()
    }
}