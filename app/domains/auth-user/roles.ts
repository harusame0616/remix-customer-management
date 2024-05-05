export const Role = {
  Admin: "admin",
  Editor: "editor",
  Viewer: "viewer",
} as const;

export const roles = Object.values(Role);
export type Role = (typeof roles)[number];

export function isRole(value: unknown): value is Role {
  return roles.includes(value as Role);
}
