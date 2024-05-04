import { users } from "~/domains/auth-user/users";

type LoginPayload = {
  email: string;
  password: string;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    success: true,
  };
}
