

export interface ScopeListInterface {

    /**
     * add()
     * 
     * adds a scope to the scope list.
     * @param scope the scope to add.
     */

    add(scope: string): ScopeListInterface

    /**
     * contains()
     * 
     * determines if the scope list consists of the scope.
     * @param scope the scope to check.
     */

    contains(scope: string): boolean;

    /**
     * remove()
     * 
     * removes a scope from the scope list.
     * @param scope the scope to remove.
     */
    
    remove(scope: string): ScopeListInterface;
}