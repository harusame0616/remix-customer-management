import { Await, useLoaderData, useNavigation } from "@remix-run/react";
import { Suspense } from "react";
import { Pagination } from "~/components/pagination";
import { DealTable } from "~/domains/deal/comopnents/deal-table";
import { useSort } from "~/hooks/use-sort";
import { loader } from "./controllers";
export { loader } from "./controllers";

const defaultSortKey = "negotiationDate";

export default function Page() {
  const loadData = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const { sortKey, sortOrder } = useSort({ defaultSortKey });

  if (!loadData.success) {
    return <div>エラー</div>;
  }

  return (
    <div className="flex flex-col h-full">
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
              {(resolvedValue) => (
                <DealTable
                  deals={resolvedValue.map((deal) => ({
                    ...deal,
                    deadline: deal.deadline
                      ? new Date(deal.deadline)
                      : undefined,
                    registeredAt: new Date(deal.registeredAt),
                    editedAt: new Date(deal.editedAt),
                  }))}
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
