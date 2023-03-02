import { PermissionSet } from './permission-set.interface';

/**
 * Permissions api.
 */

export interface PermissionInterface {

    readonly resource: string;
    readonly permissions: PermissionSet;
}