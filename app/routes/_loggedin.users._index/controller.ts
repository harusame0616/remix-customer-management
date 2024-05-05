import { defer, json, LoaderFunctionArgs } from "@remix-run/node";
import z from "zod";
import { safeParseQueryString } from "~/lib/search-params";
import { defaultSortKey } from "./constants";
import { getTotal, getUsers, sortKeys } from "./queries";
import { getRole, haveAuthorization } from "~/lib/auth";
import { Role } from "~/domains/auth-user/roles";

export function parseGetUsersSearchParams(source: URL | URLSearchParams) {
  const queryString = source instanceof URL ? source.search : source.toString();

  return safeParseQueryString(
    queryString,
    z.object({
      page: z.coerce.number().optional().default(1),
      sortKey: z.enum(sortKeys).default(defaultSortKey),
      sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
    }),
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const loaderParams = parseGetUsersSearchParams(new URL(request.url));
  if (!loaderParams.success) {
    return json(loaderParams);
  }

  const role = await getRole(request);
  if (!haveAuthorization([Role.Admin], role)) {
    throw new Response("Forbidden", { status: 403 });
  }

  const { sortKey, sortOrder, page } = loaderParams.data;
  return defer({
    success: true,
    users: getUsers({ sortKey, page, sortOrder }),
    totalCount: getTotal(),
  });
};

export type loader = typeof loader;
