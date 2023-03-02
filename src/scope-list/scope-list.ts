
import { ArrayList } from '@chaperone/util/collection';
import { ScopeListInterface } from './scope-list.interface';

/**
 * ScopeList
 * 
 * A list of scopes.
 */

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
        this.rejected = new ArrayList(rejected);
    }

    public static All(): ScopeList {
        return new ScopeList([ScopeList.ALL_SCOPES_Symbol], []);
    }

    public static Only(scopes: string[]): ScopeList {
        return new ScopeList(scopes, [ScopeList.ALL_SCOPES_Symbol]);
    }

    public static Except(scopes: string[]): ScopeList {
        return new ScopeList([ScopeList.ALL_SCOPES_Symbol], scopes);
    }

    /**
     * allowedScopes
     * 
     * gets the allowed scopes
     */

    public get allowedScopes(): string[] {
        return this.allowed.toArray();
    }

    /**
     * rejectedScopes
     * 
     * gets the rejected scopes.
     */

    public get rejectedScopes(): string[] {
        return this.rejected.toArray();
    }

    /**
     * allow()
     * 
     * allows a scope to the list.
     * @param scope the scope to allow
     */

    public allow(scope: string): void {
        scope = this.normalizeScope(scope);
        
        // remove from the rejected list
        if (this.restrictsAggregate()) {
            const indexToRemove = this.rejected.indexOf(ScopeList.ALL_SCOPES_Symbol);
            this.rejected.remove(indexToRemove);
        }

        if (this.rejected.contains(scope)) {
            const indexToRemove = this.rejected.indexOf(scope);
            this.rejected.remove(indexToRemove);
        }

        // add the scope to the list if need be.
        if (!this.allowsAggregate()) {
            this.allowed.add(scope);
        }
    }

    /**
     * allows()
     * 
     * determines if the scope list allows the scope.
     * @param scope the scope to check.
     */

    public allows(scope: string): boolean {
        scope = this.normalizeScope(scope);
        return (!this.restrictsAggregate() || !this.rejected.contains(scope)) && 
            (this.allowsAggregate() || this.allowed.contains(scope));
    }

    private allowsAggregate(): boolean {
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
        return dirty.trim();
    }

    /**
     * reject()
     * 
     * rejects a scope.
     * @param scope the scope to reject
     */
    
    public reject(scope: string): void {
        scope = this.normalizeScope(scope);

        // remove the scope from the allowed list
        if (this.allowsAggregate()) {
            const indexToRemove = this.allowed.indexOf(ScopeList.ALL_SCOPES_Symbol);
            this.allowed.remove(indexToRemove);
        }

        if (this.allowed.contains(scope)) {
            const indexToRemove = this.allowed.indexOf(scope);
            this.allowed.remove(indexToRemove);
        }

        // add the scope to the rejected list.
        if (!this.restrictsAggregate()) {
            this.rejected.add(scope);
        }
    }

    /**
     * rejects()
     * 
     * determines if a scope is rejected.
     * @param scope the scope to check.
     */
    
    public rejects(scope: string): boolean {
        return (this.restrictsAggregate() || this.rejected.contains(scope)) && (!this.allowsAggregate() || !this.allowed.contains(scope));
    }

    private restrictsAggregate(): boolean {
        return this.rejected.contains(ScopeList.ALL_SCOPES_Symbol);
    }
}