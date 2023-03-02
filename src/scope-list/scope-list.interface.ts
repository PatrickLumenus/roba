

export interface ScopeListInterface {

    /**
     * allowedScopes
     * 
     * gets the allowed scopes
     */

    readonly allowedScopes: string[];

    /**
     * rejectedScopes
     * 
     * gets the rejected scopes.
     */
    
    readonly rejectedScopes: string[];

    /**
     * allow()
     * 
     * allows a scope to the scope list
     * @param scope the scope to allow
     */

    allow(scope: string): void;

    /**
     * allows()
     * 
     * determines if the scope list allows the scope..
     * @param scope the scope to check.
     */

    allows(scope: string): boolean;

    /**
     * reject()
     * 
     * rejects a scope.
     * @param scope the scope to reject
     */
    
    reject(scope: string): void;

    /**
     * rejects()
     * 
     * determines if a scope is rejected.
     * @param scope the scope to check.
     */
    
    rejects(scope: string): boolean;
}