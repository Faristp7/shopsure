export type Role = 'user' | 'seller' | 'admin';

export const ROLES = {
    USER: 'user' as Role,
    SELLER: 'seller' as Role,
    ADMIN: 'admin' as Role,
};

export type Permission =
    | 'view:dashboard'
    | 'manage:products'
    | 'manage:orders'
    | 'view:analytics'
    | 'manage:sellers'
    | 'manage:disputes';

export const PERMISSIONS: Record<Role, Permission[]> = {
    user: [],
    seller: ['view:dashboard', 'manage:products', 'manage:orders', 'view:analytics'],
    admin: ['view:dashboard', 'manage:sellers', 'manage:orders', 'manage:disputes'],
};
