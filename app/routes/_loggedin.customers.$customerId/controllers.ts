import { defer, LoaderFunctionArgs } from "@remix-run/node";
import { roles } from "~/domains/auth-user/roles";
import { getRole, haveAuthorization } from "~/lib/auth";
import { queryCustomer } from "./queries";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { customerId } = params;
  if (!customerId) {
    throw new Response("error", { status: 400 });
  }

  const role = await getRole(request);
  if (!haveAuthorization(roles, role)) {
    throw new Response("Forbidden", { status: 403 });
  }

  return defer({
    success: true,
    role,
    customer: queryCustomer(customerId),
  });
}

export type Loader = typeof loader;
