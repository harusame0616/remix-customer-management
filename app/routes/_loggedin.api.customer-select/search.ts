import { z } from "zod";
import { safeParseQueryString } from "~/lib/search-params";

export function parseGetCustomersSearchParams(source: URL | URLSearchParams) {
  const queryString = source instanceof URL ? source.search : source.toString();

  return safeParseQueryString(
    queryString,
    z.object({
      page: z.coerce.number().optional().default(1),
      keyword: z
        .string()
        .optional()
        .transform((v) => v?.trim() || undefined),
    }),
  );
}
