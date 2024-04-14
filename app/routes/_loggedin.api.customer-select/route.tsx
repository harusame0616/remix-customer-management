import { json, LoaderFunctionArgs } from "@remix-run/node";
import { queryCustomers, queryCustomerTotalCount } from "./queries";
import { parseGetCustomersSearchParams } from "./search";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const loaderParams = parseGetCustomersSearchParams(new URL(request.url));

  if (!loaderParams.success) {
    return json(loaderParams);
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
