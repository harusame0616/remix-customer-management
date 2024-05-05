import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getRole } from "~/lib/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const role = await getRole(request);

  if (!role) {
    return redirect("/login");
  }

  return json({
    signedIn: true,
    role,
  });
}
