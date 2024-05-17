import {
  LoaderFunctionArgs,
  defer,
  json,
  type MetaFunction,
} from "@remix-run/node";
import z from "zod";
import { dealPlatformIds, dealStatusIds } from "~/domains/deal/enum";
import prisma from "~/lib/prisma";
import { safeParseQueryString } from "~/lib/search-params";
import { getDealsByCustomerId } from "./queries";

const defaultSortKey = "registeredAt";
export const meta: MetaFunction = () => {
  return [{ title: "取引一覧 - 顧客管理システム" }];
};

function parseGetDealsSearchParams(source: URL | URLSearchParams) {
  const queryString = source instanceof URL ? source.search : source.toString();

  return safeParseQueryString(
    queryString,
    z.object({
      page: z.coerce.number().optional().default(1),
      sortKey: z.string().optional().default(defaultSortKey),
      sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
      keyword: z
        .string()
        .optional()
        .transform((v) => v?.trim() || undefined),
      platformId: z.preprocess(
        (v) => (typeof v === "string" ? [v] : v),
        z
          .array(z.enum(dealPlatformIds))
          .optional()
          .transform((v) => (v?.length ? v : dealPlatformIds)),
      ),
      statusId: z.preprocess(
        (v) => (typeof v === "string" ? [v] : v),
        z
          .array(z.enum(dealStatusIds))
          .optional()
          .transform((v) => (v?.length ? v : dealStatusIds)),
      ),
      deadlineFrom: z
        .union([z.literal("").transform(() => undefined), z.coerce.date()])
        .optional(),
      deadlineTo: z
        .union([z.literal("").transform(() => undefined), z.coerce.date()])
        .optional(),
    }),
  );
}

function getDealsTotalCount() {
  return new Promise<number>((resolve) => {
    prisma.deal.count().then(resolve);
  });
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const loaderParams = parseGetDealsSearchParams(new URL(request.url));
  if (!loaderParams.success) {
    return json(loaderParams);
  }
  const customerId = params.customerId;
  if (!customerId) {
    return json({ success: false as const, message: "customerId が必要です" });
  }

  const { sortKey, sortOrder, page, ...condition } = loaderParams.data;
  return defer({
    success: true,
    deals: getDealsByCustomerId(customerId, {
      sortKey,
      page,
      sortOrder,
      condition,
    }),
    totalCount: getDealsTotalCount(),
  });
};
