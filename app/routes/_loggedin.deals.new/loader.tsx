import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Role } from "~/domains/auth-user/roles";
import { getRole, haveAuthorization } from "~/lib/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const role = await getRole(request);
  if (!haveAuthorization([Role.Admin, Role.Editor], role)) {
    throw new Response("Forbidden", { status: 403 });
  }

  return json({ success: true });
}

export type Loader = typeof loader;
