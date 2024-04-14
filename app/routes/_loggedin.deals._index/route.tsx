import {
  LoaderFunctionArgs,
  defer,
  json,
  type MetaFunction,
} from "@remix-run/node";
import { Await, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { Suspense } from "react";
import z from "zod";
import { ListPageLayout } from "~/components/list-page-layout";
import {
  DealPlatformId,
  DealStatusId,
  dealPlatformIds,
  dealStatusIds,
} from "~/domains/deal/enum";
import { useSort } from "~/hooks/use-sort";
import { PER_PAGE } from "~/lib/pagination";
import prisma from "~/lib/prisma";
import { safeParseQueryString } from "~/lib/search-params";
import { DealSearchDrawer } from "../../domains/deal/comopnents/deal-search-drawer";
import {
  DealListItem,
  DealTable,
} from "../../domains/deal/comopnents/deal-table";

const defaultSortKey = "registeredAt";
export const meta: MetaFunction = () => {
  return [{ title: "取引一覧 - 顧客管理システム" }];
};

export function parseGetDealsSearchParams(source: URL | URLSearchParams) {
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

type getDealsCondition = {
  sortKey: string;
  sortOrder: string;
  page: number;
  condition: {
    keyword?: string;
    deadlineFrom?: Date;
    deadlineTo?: Date;
    statusId?: DealStatusId[];
    platformId?: DealPlatformId[];
  };
};
function getDeals({ sortKey, sortOrder, page, condition }: getDealsCondition) {
  return new Promise<DealListItem[]>((resolve) => {
    prisma.deal
      .findMany({
        where: {
          OR: condition.keyword
            ? [
                {
                  title: {
                    contains: condition.keyword,
                  },
                },
                {
                  content: {
                    contains: condition.keyword,
                  },
                },
              ]
            : undefined,
          statusId: {
            in: condition.statusId,
          },
          platformId: {
            in: condition.platformId,
          },
          deadline: {
            gte: condition.deadlineFrom ? condition.deadlineFrom : undefined,
            lte: condition.deadlineTo ? condition.deadlineTo : undefined,
          },
        },
        orderBy: {
          [sortKey]: sortOrder,
        },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      })
      .then((deals) =>
        resolve(
          deals.map((deal) => ({
            dealId: deal.dealId,
            title: deal.title,
            statusId: deal.statusId as DealStatusId,
            deadline: deal.deadline ? deal.deadline : undefined,
            registeredAt: deal.registeredAt,
            editedAt: deal.editedAt,
          })),
        ),
      );
  });
}

function getDealsTotalCount() {
  return new Promise<number>((resolve) => {
    prisma.deal.count().then(resolve);
  });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const loaderParams = parseGetDealsSearchParams(new URL(request.url));
  if (!loaderParams.success) {
    return json(loaderParams);
  }

  const { sortKey, sortOrder, page, ...condition } = loaderParams.data;
  return defer({
    success: true,
    deals: getDeals({ sortKey, page, sortOrder, condition }),
    totalCount: getDealsTotalCount(),
  });
};

export default function Page() {
  const loadData = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const { sortKey, sortOrder } = useSort({ defaultSortKey });

  if (!loadData.success) {
    return <div>error</div>;
  }

  return (
    <ListPageLayout
      title="取引一覧"
      toolbarItems={[
        <DealSearchDrawer key="search" />,
        <Link to="/deals/new" key="register">
          新規登録
        </Link>,
      ]}
      totalCount={loadData.totalCount}
    >
      {navigation.location?.pathname === "/deals" ? (
        <DealTable sortKey={sortKey} sortOrder={sortOrder} skeleton />
      ) : (
        <Suspense
          fallback={
            <DealTable sortKey={sortKey} sortOrder={sortOrder} skeleton />
          }
        >
          <Await resolve={loadData.deals}>
            {(deals) => (
              <DealTable
                deals={deals.map((deal) => ({
                  ...deal,
                  deadline: deal.deadline ? new Date(deal.deadline) : undefined,
                  editedAt: new Date(deal.editedAt),
                  registeredAt: new Date(deal.registeredAt),
                }))}
                sortKey={sortKey}
                sortOrder={sortOrder}
              />
            )}
          </Await>
        </Suspense>
      )}
    </ListPageLayout>
  );
}
