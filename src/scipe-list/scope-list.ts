
import { ArrayList } from '@chaperone/util/collection';
import { ScopeListInterface } from './scope-list.interface';


export class ScopeList implements ScopeListInterface {

    private allowed: ArrayList<string>;
    private rejected: ArrayList<string>;
    private static ALL_SCOPES_Symbol = '*';

    constructor(allowed: string[], rejected: string[]) {
        allowed = allowed.map(scope => {
            return this.normalizeScope(scope);
        });
        this.allowed = new ArrayList(allowed);

        rejected = allowed.map(scope => {
            return this.normalizeScope(scope);
        });
        this.rejected = new ArrayList(allowed);
    }

    public static All(): ScopeList {
        return new ScopeList([ScopeList.ALL_SCOPES_Symbol], []);
    }

    /**
     * add()
     * 
     * adds a scope to the scope list.
     * @param scope the scope to add.
     */

    public add(scope: string): ScopeList {
        scope = this.normalizeScope(scope);
    }

    /**
     * contains()
     * 
     * determines if the scope list consists of the scope.
     * @param scope the scope to check.
     */

    public contains(scope: string): boolean {
        
    }

    private hasAggregate(): boolean {
        return this.allowed.contains(ScopeList.ALL_SCOPES_Symbol);
    }

    /**
     * normalizeScope()
     * 
     * normalizes the scope.
     * @param dirty the dirty scope
     * @returns the normalized scope. 
     */

    private normalizeScope(dirty: string): string {
        return dirty
            .toLocaleLowerCase()
            .trim()
            .replace(" ", "-")
    }

    /**
     * remove()
     * 
     * removes a scope from the scope list.
     * @param scope the scope to remove.
     */

    remove(scope: string): ScopeListInterface {

    }

    private restrictsAggregate(): boolean {
        return this.rejected.contains(ScopeList.ALL_SCOPES_Symbol);
    }
}