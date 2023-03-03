import { Equatable, Serializable } from '@chaperone/util';
import { GrantSet } from './grant-set';


export class Permission implements Equatable, Serializable {

    readonly name: string;
    readonly grants: GrantSet;

    constructor(name: string, grants: GrantSet) {
        this.name = name;
        this.grants = grants;
    }

    public static None(name: string): Permission {
        return new Permission(name, GrantSet.None());
    }

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
        return JSON.stringify({
            name: String,
            grants: this.grants.serialize()
        });
    }
}