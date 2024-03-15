import { defer } from "@remix-run/node";
import { Await, useLoaderData, useNavigation } from "@remix-run/react";
import { Suspense } from "react";
import { Pagination } from "~/components/pagination";
import { Table } from "~/components/table";
import { Skeleton } from "~/components/ui/skeleton";
import { negotiationsFixture } from "~/fixtures/negotiations";
import { useSort } from "~/hooks/use-sort";
import { SortOrder } from "~/lib/table";

const defaultSortKey = "negotiationDate";

export function loader() {
  const negotiations = negotiationsFixture.map((negotiation) => ({
    negotiationDate: negotiation.startDate,
    owner: negotiation.owner,
    status: negotiation.status,
    title: negotiation.title,
    description: negotiation.description,
  }));
  return defer({
    negotiations: new Promise<typeof negotiations>((r) =>
      setTimeout(() => r(negotiations), 1000),
    ),
  });
}

export default function Page() {
  const loadData = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const { sortKey, sortOrder } = useSort({ defaultSortKey });

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-grow overflow-hidden">
        {navigation.location ? (
          <NegotiationTable sortKey={sortKey} sortOrder={sortOrder} skeleton />
        ) : (
          <Suspense
            fallback={
              <NegotiationTable
                sortKey={sortKey}
                sortOrder={sortOrder}
                skeleton
              />
            }
          >
            <Await resolve={loadData.negotiations}>
              {(resolvedValue) => (
                <NegotiationTable
                  negotiations={resolvedValue}
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              )}
            </Await>
          </Suspense>
        )}
      </div>
      <Pagination totalCount={10} className="md:px-4" />
    </div>
  );
}

const headers = [
  { sortKey: "startDate", label: "施術日", noSort: true },
  { sortKey: "owner", label: "担当" },
  { sortKey: "status", label: "ステータス" },
  { sortKey: "title", label: "タイトル" },
  { sortKey: "content", label: "内容" },
];
type NegotiationTableProps = {
  skeleton?: false;
  negotiations: {
    negotiationDate: string;
    owner: string;
    status: string;
    title: string;
    description: string;
  }[];
  sortKey: string;
  sortOrder: SortOrder;
};
type NegotiationTableSkeletonProps = {
  skeleton: true;
  sortKey: string;
  sortOrder: SortOrder;
};
function NegotiationTable(
  props: NegotiationTableProps | NegotiationTableSkeletonProps,
) {
  const customers = props.skeleton
    ? Array.from({ length: 10 }).map(() => {
        return {
          negotiationDate: <Skeleton className="h-4 w-20" />,
          owner: <Skeleton className="h-4 w-40" />,
          status: <Skeleton className="h-4 w-20" />,
          title: <Skeleton className="h-4 w-20" />,
          description: <Skeleton className="h-4 w-32" />,
        };
      })
    : props.negotiations.map((negotiation) => ({
        ...negotiation,
        note: undefined,
      }));

  return (
    <Table
      rows={customers}
      headers={headers}
      sortKey={props.sortKey}
      sortOrder={props.sortOrder}
    />
  );
}
