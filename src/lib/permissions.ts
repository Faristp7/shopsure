import { Permission, PERMISSIONS, Role } from './roles';

export function hasPermission(role: Role, permission: Permission): boolean {
    return PERMISSIONS[role]?.includes(permission) ?? false;
}
