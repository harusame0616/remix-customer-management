import { defer, json, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { safeParseQueryString } from "~/lib/search-params";
import {
  queryCustomers as queryCustomers,
  queryCustomerTotalCount,
} from "./queries";
import { DEFAULT_SORT_KEY } from "./constants";

function parseGetSearchParams(source: string | URL) {
  const queryString = source instanceof URL ? source.search : source.toString();

  return safeParseQueryString(
    queryString,
    z.object({
      page: z.coerce.number().optional().default(1),
      sortKey: z.string().optional().default(DEFAULT_SORT_KEY),
      sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
    }),
  );
}
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const loaderParams = parseGetSearchParams(new URL(request.url));

  if (!loaderParams.success) {
    return json(loaderParams);
  }

  return defer({
    success: true,
    customers: queryCustomers({
      sortKey: loaderParams.data.sortKey,
      sortOrder: loaderParams.data.sortOrder,
      page: loaderParams.data.page,
      condition: {},
    }),
    totalCount: queryCustomerTotalCount({ condition: {} }),
  });
};

export type Loader = typeof loader;
