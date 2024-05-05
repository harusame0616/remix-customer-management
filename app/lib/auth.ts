import { signedInUser } from "~/cookies.server";
import { isRole, Role } from "~/domains/auth-user/roles";
import { users } from "~/domains/auth-user/users";

type LoginPayload = {
  email: string;
  password: string;
};
export async function login(payload: LoginPayload) {
  const user = users.find((user) => user.email === payload.email);

  return payload.password === "password" && user
    ? { success: true, role: user.role }
    : { success: false };
}

type ResetPayload = {
  email: string;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function resetPassword(payload: ResetPayload) {
  return {
    success: true,
  };
}

export async function getRole(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const { role } = (await signedInUser.parse(cookieHeader)) || {};

  return isRole(role) ? role : null;
}

export function haveAuthorization<PermittedRoles extends Role[]>(
  permittedRoles: PermittedRoles,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  role: any,
): role is PermittedRoles[number] {
  return !!role && !!permittedRoles.includes(role);
}
