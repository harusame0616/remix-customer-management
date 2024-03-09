import { LoaderFunctionArgs, defer, type MetaFunction } from "@remix-run/node";
import { Await, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { format } from "date-fns";
import { ReactNode, Suspense } from "react";
import { Table } from "~/components/table";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import {
  DealStatus,
  DealStatusId,
  dealStatusLabelMap,
} from "~/domains/deal/enum";
import { useSort } from "~/hooks/use-sort";
import { PER_PAGE, toPage } from "~/lib/pagination";
import prisma from "~/lib/prisma";
import { SortOrder, toSortOrder } from "~/lib/table";
import { Pagination } from "../components/pagination";

export const meta: MetaFunction = () => {
  return [{ title: "取引一覧 - 顧客管理システム" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = toPage(url.searchParams.get("page"));
  const sortKey = url.searchParams.get("sortKey") ?? "registeredAt";
  const sortOrder = toSortOrder(url.searchParams.get("sortOrder"));

  return defer({
    deals: new Promise<DealListItem[]>((resolve) => {
      prisma.deal
        .findMany({
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
    }),
    totalCount: new Promise<number>((resolve) => {
      prisma.deal.count().then(resolve);
    }),
  });
};

export default function Index() {
  const loadData = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const { sortKey, sortOrder } = useSort();

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 md:px-4 flex">
        <h1>顧客一覧</h1>
        <div className="flex-grow flex justify-end">
          <Link to="/deals/new">新規登録</Link>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col flex-grow overflow-hidden">
        {navigation.location ? (
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
                    deadline: deal.deadline
                      ? new Date(deal.deadline)
                      : undefined,
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
      </div>
      <Separator />
      <Suspense>
        <Await resolve={loadData.totalCount}>
          {(totalCount) => (
            <Pagination totalCount={totalCount} className="md:px-4" />
          )}
        </Await>
      </Suspense>
    </div>
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
      sortKey={props.sortKey}
      sortOrder={props.sortOrder}
    />
  );
}
