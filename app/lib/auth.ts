// TODO: Implement the login function
type LoginPayload = {
  email: string;
  password: string;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function login(payload: LoginPayload) {
  const role = {
    "admin@example.com": "admin",
    "editor@example.com": "editor",
    "viewer@example.com": "viewer",
  }[payload.email];

  return payload.password === "password" && role
    ? { success: true, role }
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
