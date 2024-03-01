// TODO: Implement the login function
type LoginPayload = {
  email: string;
  password: string;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function login(payload: LoginPayload) {
  return { success: !true };
}
