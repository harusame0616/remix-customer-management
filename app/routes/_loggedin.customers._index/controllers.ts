import { defer, json, LoaderFunctionArgs } from "@remix-run/node";
import { queryCustomers, queryCustomerTotalCount } from "./queries";
import { parseGetCustomersSearchParams } from "./search";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const loaderParams = parseGetCustomersSearchParams(new URL(request.url));

  if (!loaderParams.success) {
    return json(loaderParams);
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
    totalCount: queryCustomerTotalCount({ condition }),
  });
};

export type Loader = typeof loader;
