// TODO: Implement the login function
type LoginPayload = {
  email: string;
  password: string;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function login(payload: LoginPayload) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    success:
      [
        "admin@example.com",
        "editor@example.com",
        "viewer@example.com",
      ].includes(payload.email) && payload.password === "password",
  };
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

export async function isLoggedIn() {
  return true;
}
