import { json, LoaderFunctionArgs } from "@remix-run/node";
import { roles } from "~/domains/auth-user/roles";
import { getRole, haveAuthorization } from "~/lib/auth";
import { queryCustomers, queryCustomerTotalCount } from "./queries";
import { parseGetCustomersSearchParams } from "./search";

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
  const [customers, totalCount] = await Promise.all([
    queryCustomers({
      sortKey: "name",
      sortOrder: "asc",
      page: loaderParams.data.page,
      condition,
    }),
    queryCustomerTotalCount({ condition }),
  ]);

  return json({
    success: true,
    customers,
    totalCount,
  });
};

export type Loader = typeof loader;
