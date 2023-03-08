import { Equatable, Serializable } from '@chaperone/util';
import { GrantType } from './grant-type.type';

/**
 * GrantSet
 * 
 * A set of grants.
 */

export class GrantSet implements Equatable, Serializable {

    readonly create: GrantType;
    readonly view: GrantType;
    readonly update: GrantType;
    readonly destroy: GrantType;

    /**
     * Creates a Grant Type.
     * @param create the create grant
     * @param view the view (read) grant.
     * @param update the update grant.
     * @param destroy the destroy (delete) grant.
     */

    constructor(create: GrantType, view: GrantType, update: GrantType, destroy: GrantType) {
        this.create = create;
        this.view = view;
        this.update = update;
        this.destroy = destroy;
    }

    /**
     * All()
     * 
     * Creates a GrantSet instance that grants access to all actions.
     * @returns the created grant set
     */

    public static All(): GrantSet {
        return new GrantSet('any', 'any', 'any', 'any');
    }

    /**
     * None()
     * 
     * Creates a GrantType instance that grants no actions.
     * @returns the created grant type
     */

    public static None(): GrantSet {
        return new GrantSet('none', 'none', 'none', 'none');
    }

    /**
     * Private()
     * 
     * creates a GrantType instance that onlt allows the owner to perform access or modify actions.
     * @returns the created instance
     */

    public static Private(): GrantSet {
        return new GrantSet('own', 'own', 'own', 'own');
    }

    /**
     * Protected()
     * 
     * Creates a GrantType instance where anyone can create and view. However, only the owner of the resource can update and delete.
     * @returns The created instance
     */

    public static Protected(): GrantSet {
        return new GrantSet('own', 'any', 'own', 'own');
    }

    /**
     * Public()
     * 
     * Creates a GrantSet where all actions are permitted except the destroy action.
     * @returns The created instance.
     */

    public static Public(): GrantSet {
        return new GrantSet('any', 'any', 'any', 'none');
    }

    /**
     * ViewOnly()
     * 
     * Creates a GrantSet where the view action is the only allowed action.
     * @returns the created instance.
     */

    public static ViewOnly(): GrantSet {
        return new GrantSet('none', 'any', 'none', 'none');
    }

    public equals(suspect: any): boolean {
        let isEqual = false;

        if (suspect instanceof GrantSet) {
            const other = suspect as GrantSet;
            isEqual = (
                (this.create === other.create) &&
                (this.view === other.view) &&
                (this.update === other.update) &&
                (this.destroy === other.destroy)
            );
        }

        return isEqual;
    }

    public serialize(): string {
        return JSON.stringify({
            create: this.create,
            view: this.view,
            update: this.update,
            destroy: this.destroy
        })
    }
}