import { defer, json, LoaderFunctionArgs } from "@remix-run/node";
import { queryCustomers, queryCustomerTotalCount } from "./queries";
import { parseGetCustomersSearchParams } from "./search";
import { getRole, haveAuthorization } from "~/lib/auth";
import { roles } from "~/domains/auth-user/roles";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const loaderParams = parseGetCustomersSearchParams(new URL(request.url));
  if (!loaderParams.success) {
    return json(loaderParams);
  }

  const role = await getRole(request);
  if (!haveAuthorization(roles, role)) {
    throw new Response("Forbidden", { status: 403 });
  }

  const condition = { keyword: loaderParams.data.keyword };
  return defer({
    success: true,
    customers: queryCustomers({
      sortKey: loaderParams.data.sortKey,
      sortOrder: loaderParams.data.sortOrder,
      page: loaderParams.data.page,
      condition,
    }),
    role,
    totalCount: queryCustomerTotalCount({ condition }),
  });
};

export type Loader = typeof loader;
