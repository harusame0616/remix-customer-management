import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { signedInUser } from "~/cookies.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await signedInUser.parse(cookieHeader)) || {};

  if (!cookie.role) {
    return redirect("/login");
  }

  return json({
    signedIn: true,
    role: cookie.role,
    email: cookie.email,
  });
}
