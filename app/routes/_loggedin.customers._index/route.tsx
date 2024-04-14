import { type MetaFunction } from "@remix-run/node";
import { Await, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { Suspense } from "react";
import { ListPageLayout } from "~/components/list-page-layout";
import { useSort } from "~/hooks/use-sort";
import { DEFAULT_SORT_KEY } from "./search";
import { Loader } from "./controllers";
import { CustomerSearchDrawer } from "./customer-search-drawer";
import { CustomerTable } from "./customer-table";
export { loader } from "./controllers";

export const meta: MetaFunction = () => {
  return [{ title: "顧客一覧 - 顧客管理システム" }];
};

export default function Page() {
  const loadData = useLoaderData<Loader>();

  const navigation = useNavigation();
  const { sortKey, sortOrder } = useSort({ defaultSortKey: DEFAULT_SORT_KEY });

  if (!loadData.success) {
    return <div>error</div>;
  }

  return (
    <ListPageLayout
      title="顧客一覧"
      totalCount={loadData.totalCount}
      toolbarItems={[
        <CustomerSearchDrawer key="search" />,
        <Link to="/customers/new" key="register">
          新規登録
        </Link>,
      ]}
    >
      {navigation.location?.pathname === "/customers" ? (
        <CustomerTable sortKey={sortKey} sortOrder={sortOrder} skeleton />
      ) : (
        <Suspense
          fallback={
            <CustomerTable sortKey={sortKey} sortOrder={sortOrder} skeleton />
          }
        >
          <Await resolve={loadData.customers}>
            {(customers) => (
              <CustomerTable
                customers={customers}
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
