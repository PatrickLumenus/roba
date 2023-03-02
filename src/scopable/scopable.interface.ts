import { ScopeListInterface } from './../scope-list';

export interface Scopable {

    /**
     * the list of scopes
     */
    
    readonly scopes: ScopeListInterface;
}