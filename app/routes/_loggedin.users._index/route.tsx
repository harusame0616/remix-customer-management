import { type MetaFunction } from "@remix-run/node";
import { Await, useLoaderData, useNavigation } from "@remix-run/react";
import { Suspense } from "react";
import { ListPageLayout } from "~/components/list-page-layout";
import { Button } from "~/components/ui/button";
import { UserTable } from "~/domains/auth-user/user-table";
import { useSort } from "~/hooks/use-sort";
import { loader } from "./controller";
import { defaultSortKey } from "./constants";
export { loader } from "./controller";

export const meta: MetaFunction = () => {
  return [{ title: "ユーザー一覧 - 顧客管理システム" }];
};

export default function Page() {
  const loadData = useLoaderData<loader>();

  const navigation = useNavigation();
  const { sortKey, sortOrder } = useSort({ defaultSortKey });

  if (!loadData.success) {
    return <div>error</div>;
  }

  return (
    <ListPageLayout
      title="ユーザー一覧"
      toolbarItems={[
        <div className="text-destructive" key="note">
          デモ環境では新規作成、編集、削除は行えません
        </div>,
        <Button key="create" variant="outline" disabled>
          新規作成
        </Button>,
      ]}
      totalCount={loadData.totalCount}
    >
      {navigation.location?.pathname === "/users" ? (
        <UserTable sortKey={sortKey} sortOrder={sortOrder} skeleton />
      ) : (
        <Suspense
          fallback={
            <UserTable sortKey={sortKey} sortOrder={sortOrder} skeleton />
          }
        >
          <Await resolve={loadData.users}>
            {(users) => (
              <UserTable
                users={users}
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
