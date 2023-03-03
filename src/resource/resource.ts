import { Equatable, Serializable } from '@chaperone/util';
import { Scopable, Scope } from './../scopable';


export class Resource implements Scopable, Equatable, Serializable {

    readonly name: string;
    readonly id: string|null;
    readonly owner: string|null;
    readonly scope: string;

    private constructor(name: string, id: string|null = null, owner: string|null, scope: string = Scope.Global) {
        this.name = name;
        this.id = id;
        this.owner = owner;
        this.scope = scope;
    }

    public static Collecton(name: string, scope: string = Scope.Global): Resource {
        return new Resource(name, null, null, scope)
    }

    public static Instance(name: string, id: string, owner: string, scope: string = Scope.Global): Resource {
        return new Resource(name, id, owner, scope);
    }

    get isInstance(): boolean {
        return (this.id !== null) && (this.owner !== null);
    }

    get isCollection(): boolean {
        return !this.isInstance;
    }
 
    public equals(suspect: any): boolean {
        let isEqual = false;

        if (suspect instanceof Resource) {
            const other = suspect as Resource;
            isEqual = (
                (this.name === other.name) &&
                (this.id === other.id) &&
                (this.owner === other.owner) &&
                (this.scope === other.scope)
            )
        }

        return isEqual;
    }

    public serialize(): string {
        return JSON.stringify({
            name: this.name,
            id: this.id || null,
            owner: this.owner || null,
            scope: this.scope
        });
    }
}