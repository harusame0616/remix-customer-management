import { ReactNode } from "react";
import { Table } from "~/components/table";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { SortOrder } from "~/lib/table";

export type UserListItem = {
  userId: string;
  name: string;
  email: string;
  role: string;
};
const headers = [
  { sortKey: "name", label: "名前" },
  { sortKey: "email", label: "メールアドレス" },
  { sortKey: "role", label: "ロール" },
  { sortKey: "menu", label: "メニュー" },
];
type DealTableProps = {
  skeleton?: false;
  users: UserListItem[];
  sortKey: string;
  sortOrder: SortOrder;
};
type DealTableSkeletonProps = {
  skeleton: true;
  sortKey: string;
  sortOrder: SortOrder;
};
export function UserTable(props: DealTableProps | DealTableSkeletonProps) {
  const rows: Record<Exclude<keyof UserListItem, "userId">, ReactNode>[] =
    props.skeleton
      ? Array.from({ length: 10 }).map(() => {
          return {
            name: <Skeleton className="h-4 w-30" />,
            email: <Skeleton className="h-4 w-20" />,
            role: <Skeleton className="h-4 w-16" />,
            menu: <Skeleton className="h-4 w-8" />,
          };
        })
      : props.users.map((user) => ({
          name: user.name,
          email: user.email,
          role: user.role,
          menu: (
            <div className="flex gap-1">
              <Button variant="outline" disabled>
                編集
              </Button>
              <Button variant="destructive" disabled>
                削除
              </Button>
            </div>
          ),
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
