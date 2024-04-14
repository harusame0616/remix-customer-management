import { Link } from "@remix-run/react";
import { format } from "date-fns";
import { ReactNode } from "react";
import { Table } from "~/components/table";
import { Skeleton } from "~/components/ui/skeleton";
import {
  DealStatus,
  DealStatusId,
  dealStatusLabelMap,
} from "~/domains/deal/enum";
import { SortOrder } from "~/lib/table";

export type DealListItem = {
  dealId: string;
  title: string;
  statusId: DealStatusId;
  deadline?: Date;
  registeredAt: Date;
  editedAt: Date;
};
const headers = [
  { sortKey: "detailLink", label: "詳細", noSort: true },
  { sortKey: "title", label: "タイトル" },
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
export function DealTable(props: DealTableProps | DealTableSkeletonProps) {
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
