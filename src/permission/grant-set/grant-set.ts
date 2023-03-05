import { Equatable, Serializable } from '@chaperone/util';
import { GrantType } from './grant-type.type';

export class GrantSet implements Equatable, Serializable {

    readonly create: GrantType;
    readonly view: GrantType;
    readonly update: GrantType;
    readonly destroy: GrantType;

    constructor(create: GrantType, view: GrantType, update: GrantType, destroy: GrantType) {
        this.create = create;
        this.view = view;
        this.update = update;
        this.destroy = destroy;
    }

    public static All(): GrantSet {
        return new GrantSet('any', 'any', 'any', 'any');
    }

    public static None(): GrantSet {
        return new GrantSet('none', 'none', 'none', 'none');
    }

    public static Protected(): GrantSet {
        return new GrantSet('own', 'any', 'own', 'own');
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