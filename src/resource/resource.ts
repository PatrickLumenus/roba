import { Equatable, Serializable } from '@chaperone/util';
import { Actor } from '../entities';
import { Scopable, Scope } from './../scopable';


/**
 * Resource
 * 
 * A resource.
 */

export abstract class Resource implements Scopable, Equatable, Serializable {

    readonly name: string;
    readonly scope: string;

    /**
     * Creates a Resource.
     * @param name The name of the resource.
     * @param scope the scope of the resource. Defaults to the global scope.
     */

    constructor(name: string, scope: string = Scope.Global) {
        this.name = name;
        this.scope = scope;
    }

    /**
     * Collection
     * 
     * Creates a resource collection instance.
     * @param name the name of the resource. This name should be plural.
     * @param scope the scope of the resource instance. Defaults to the global scope.
     * @returns an instance of a resource collection.
     */
    public static Collection(name: string, scope: string = Scope.Global): ResourceCollection {
        return new ResourceCollection(name, scope);
    }

    /**
     * Instance()
     * 
     * Creates a resource instance.
     * @param name the name of the resource. This should be plural, as it refers to the resource collection.
     * @param id a unique identifier used to identify the resource instance.
     * @param owner a unique identifier for the owner of the resource.
     * @param scope the scope of the resource. Defaults to Global scope.
     * @returns a ResourceInstance instance.
     */

    public static Instance(name: string, id: string, owner: string, scope: string = Scope.Global): ResourceInstance {
        return new ResourceInstance(name, id, owner, scope);
    }

    /**
     * InstanceOf()
     * 
     * Creates a Resource Instance from the provided resource collection.
     * @param collection the collection to derrive from.
     * @param id the id of the instance.
     * @param owner the owner of the instance.
     * @returns the created instance.
     */

    public static InstanceOf(collection: ResourceCollection,id: string, owner: Actor): ResourceInstance {
        return Resource.Instance(collection.name, id, owner.id, collection.scope);
    }
 
    public equals(suspect: any): boolean {
        let isEqual = false;

        if (suspect instanceof Resource) {
            const other = suspect as Resource;
            isEqual = (
                (this.name === other.name) &&
                (this.scope === other.scope)
            )
        }

        return isEqual;
    }

    public serialize(): string {
        return JSON.stringify({
            name: this.name,
            scope: this.scope
        });
    }
}

/**
 * ResourceCollection
 * 
 * A Resource Collection.
 */

export class ResourceCollection extends Resource {

    constructor(name: string, scope: string = Scope.Global) {
        super(name, scope);
    }

    public equals(suspect: any): boolean {
        if (suspect instanceof ResourceCollection) {
            return super.equals(suspect);
        }
        else {
            return false;
        }
    }
}

/**
 * ResourceInstance
 * 
 * An instance of a Resource.
 */

export class ResourceInstance extends Resource {

    readonly id: string;
    readonly owner: string;

    constructor(name: string, id: string, owner: string, scope: string = Scope.Global) {
        super(name, scope);
        this.id = id;
        this.owner = owner;
    }

    public equals(suspect: any): boolean {
        let isEqual = false;

        if (suspect instanceof ResourceInstance) {
            const other = suspect as ResourceInstance;
            isEqual = (
                super.equals(suspect) &&
                (this.id === other.id) &&
                (this.owner === other.owner)
            );
        }

        return isEqual;
    }

    public serialize(): string {
        return JSON.stringify({
            name: this.name,
            scope: this.scope,
            id: this.id,
            owner: this.owner
        });
    }

    public toString(): string {
        return this.serialize();
    }
}