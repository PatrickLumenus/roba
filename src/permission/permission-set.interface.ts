import { PermissionValue } from './permission-value..type';

export interface PermissionSet {
    readonly create: PermissionValue;
    readonly read: PermissionValue;
    readonly update: PermissionValue;
    readonly delete: PermissionValue;
}