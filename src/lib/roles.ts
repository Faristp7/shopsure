export type Role = "USER" | "SELLER" | "ADMIN";

export const ROLES = {
  USER: "USER" as Role,
  SELLER: "SELLER" as Role,
  ADMIN: "ADMIN" as Role,
};

export type Permission =
  | "view:dashboard"
  | "manage:products"
  | "manage:orders"
  | "view:analytics"
  | "manage:sellers"
  | "manage:disputes";

export const PERMISSIONS: Record<Role, Permission[]> = {
  USER: [],
  SELLER: [
    "view:dashboard",
    "manage:products",
    "manage:orders",
    "view:analytics",
  ],
  ADMIN: [
    "view:dashboard",
    "manage:sellers",
    "manage:orders",
    "manage:disputes",
  ],
};
