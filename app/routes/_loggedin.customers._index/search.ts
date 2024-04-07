import { z } from "zod";
import { safeParseQueryString } from "~/lib/search-params";
export const DEFAULT_SORT_KEY = "name";

export function parseGetCustomersSearchParams(source: URL | URLSearchParams) {
  const queryString = source instanceof URL ? source.search : source.toString();

  return safeParseQueryString(
    queryString,
    z.object({
      page: z.coerce.number().optional().default(1),
      sortKey: z.string().optional().default(DEFAULT_SORT_KEY),
      sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
      keyword: z
        .string()
        .optional()
        .transform((v) => v?.trim() || undefined),
    }),
  );
}
