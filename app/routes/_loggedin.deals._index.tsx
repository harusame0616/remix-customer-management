import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoaderFunctionArgs,
  defer,
  json,
  type MetaFunction,
} from "@remix-run/node";
import {
  Await,
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { format } from "date-fns";
import { ReactNode, Suspense } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { FormCheckbox, FormInput } from "~/components/form-input";
import { ListPageLayout } from "~/components/list-page-layout";
import { SearchDrawer } from "~/components/search-drawer";
import { Table } from "~/components/table";
import { Skeleton } from "~/components/ui/skeleton";
import {
  DealPlatform,
  DealPlatformId,
  DealStatus,
  DealStatusId,
  dealPlatformIds,
  dealStatusIds,
  dealStatusLabelMap,
} from "~/domains/deal/enum";
import { useSort } from "~/hooks/use-sort";
import { PER_PAGE } from "~/lib/pagination";
import prisma from "~/lib/prisma";
import { safeParseQueryString } from "~/lib/search-params";
import { SortOrder } from "~/lib/table";

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
  console.log({ condition });
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
  console.log(loaderParams);
  if (!loaderParams.success) {
    return json(loaderParams);
  }

  const { sortKey, sortOrder, page, ...condition } = loaderParams.data;
  console.log({ sortKey, sortOrder, page, condition });
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

const searchFormSchema = z.object({
  keyword: z
    .string()
    .max(255)
    .transform((v) => v.trim() || undefined),
  deadlineFrom: z.union([
    z.literal("").transform(() => undefined),
    z.string().transform((v) => v + "T00:00:00+09:00"),
  ]),
  deadlineTo: z.union([
    z.literal("").transform(() => undefined),
    z.string().transform((v) => v + "T23:59:59+09:00"),
  ]),
  statusId: z.array(z.enum(dealStatusIds)),
  platformId: z.array(z.enum(dealPlatformIds)),
});
function DealSearchDrawer() {
  const [searchParam] = useSearchParams();
  const queries = parseGetDealsSearchParams(searchParam);

  const defaultValues: DefaultValues<z.input<typeof searchFormSchema>> = {
    keyword: queries.success ? queries.data.keyword || "" : "",
    statusId: queries.success ? queries.data.statusId : dealStatusIds,
    platformId: queries.success ? queries.data.platformId : dealPlatformIds,
    deadlineFrom:
      queries.success && queries.data.deadlineFrom
        ? format(queries.data.deadlineFrom, "yyyy-MM-dd")
        : "",
    deadlineTo:
      queries.success && queries.data.deadlineTo
        ? format(queries.data.deadlineTo, "yyyy-MM-dd") || ""
        : "",
  };

  const form = useForm<
    z.input<typeof searchFormSchema>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    z.output<typeof searchFormSchema>
  >({
    defaultValues,
    resolver: zodResolver(searchFormSchema),
  });

  return (
    <FormProvider {...form}>
      <SearchDrawer className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
        <div className="md:col-span-3">
          <FormInput
            control={form.control}
            label="キーワード"
            description="タイトル、取引内容から検索"
            name="keyword"
          />
        </div>
        <FormCheckbox
          column={3}
          control={form.control}
          name="statusId"
          label="ステータス"
          selects={Object.values(DealStatus).map((status) => ({
            label: status.label,
            value: status.dealStatusId,
          }))}
        />
        <FormCheckbox
          column={3}
          control={form.control}
          name="platformId"
          label="プラットフォーム"
          selects={Object.values(DealPlatform).map((platform) => ({
            label: platform.label,
            value: platform.dealPlatformId,
          }))}
        />
        <fieldset>
          <legend className="text-sm">締め切り</legend>
          <div className="flex gap-2">
            <FormInput
              control={form.control}
              label="from"
              type="date"
              name="deadlineFrom"
            />
            <FormInput
              control={form.control}
              label="to"
              type="date"
              name="deadlineTo"
            />
          </div>
        </fieldset>
      </SearchDrawer>
    </FormProvider>
  );
}

type DealListItem = {
  dealId: string;
  title: string;
  statusId: DealStatusId;
  deadline?: Date;
  registeredAt: Date;
  editedAt: Date;
};

const headers = [
  { sortKey: "detailLink", label: "詳細", noSort: true },
  { sortKey: "title", label: "名前" },
  { sortKey: "statusId", label: "ステータス" },
  { sortKey: "deadline", label: "締め切り" },
  { sortKey: "registeredAt", label: "登録日" },
  { sortKey: "editedAt", label: "編集日" },
];
type DealTableProps = {
  skeleton?: false;
  deals: DealListItem[];
  sortKey: string;
  sortOrder: SortOrder;
};
type DealTableSkeletonProps = {
  skeleton: true;
  sortKey: string;
  sortOrder: SortOrder;
};
function DealTable(props: DealTableProps | DealTableSkeletonProps) {
  const statusColorClassMap: Record<DealStatusId, string> = {
    [DealStatus.Canceled.dealStatusId]: "text-gray-500",
    [DealStatus.Rejected.dealStatusId]: "text-red-500",
    [DealStatus.Completed.dealStatusId]: "text-green-500",
    [DealStatus.InProgress.dealStatusId]: "text-blue-500",
    [DealStatus.UnderConsideration.dealStatusId]: "text-yellow-500",
    [DealStatus.UnderProposal.dealStatusId]: "text-purple-500",
  };
  const rows: Record<Exclude<keyof DealListItem, "dealId">, ReactNode>[] =
    props.skeleton
      ? Array.from({ length: 10 }).map(() => {
          return {
            title: <Skeleton className="h-4 w-30" />,
            statusId: <Skeleton className="h-4 w-20" />,
            deadline: <Skeleton className="h-4 w-16" />,
            detailLink: <Skeleton className="h-4 w-10" />,
            registeredAt: <Skeleton className="h-4 w-24" />,
            editedAt: <Skeleton className="h-4 w-24" />,
          };
        })
      : props.deals.map((deal) => ({
          title: deal.title,
          statusId: (
            <span className={statusColorClassMap[deal.statusId]}>
              {dealStatusLabelMap[deal.statusId]}
            </span>
          ),
          deadline: deal.deadline ? format(deal.deadline, "yyyy-MM-dd") : "-",
          detailLink: <Link to={`/deals/${deal.dealId}`}>詳細</Link>,
          registeredAt: format(deal.registeredAt, "yyyy-MM-dd HH:mm"),
          editedAt: format(deal.editedAt, "yyyy-MM-dd HH:mm"),
        }));

  return (
    <Table
      rows={rows}
      headers={headers}
      currentSortKey={props.sortKey}
      sortOrder={props.sortOrder}
    />
  );
}
