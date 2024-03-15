import { LoaderFunctionArgs, defer, type MetaFunction } from "@remix-run/node";
import { Await, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { Suspense } from "react";
import { Table } from "~/components/table";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { customersFixture } from "~/fixtures/customers";
import { useSort } from "~/hooks/use-sort";
import { PER_PAGE, toPage } from "~/lib/pagination";
import { SortOrder, toSortOrder } from "~/lib/table";
import { Pagination } from "../components/pagination";

const defaultSortKey = "fullName";
export const meta: MetaFunction = () => {
  return [{ title: "顧客一覧 - 顧客管理システム" }];
};

function isCustomerKey(
  key: string,
): key is keyof (typeof customersFixture)[number] {
  return key in customersFixture[0];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = toPage(url.searchParams.get("page"));
  const sortKey = url.searchParams.get("sortKey") ?? defaultSortKey;
  const sortOrder = toSortOrder(url.searchParams.get("sortOrder"));

  if (!isCustomerKey(sortKey)) {
    return new Response("Invalid sort key", { status: 400 });
  }

  const offset = (page - 1) * PER_PAGE;
  const customers = customersFixture
    .slice()
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return `${a[sortKey]}`.localeCompare(`${b[sortKey]}`);
      } else if (sortOrder === "desc") {
        return `${b[sortKey]}`.localeCompare(`${a[sortKey]}`);
      } else {
        throw new Error("Invalid sort order");
      }
    })
    .slice(offset, offset + PER_PAGE)
    .map((customer) => ({ ...customer, note: "" }));

  return defer({
    customers: new Promise<typeof customers>((r) =>
      setTimeout(() => r(customers), 1000),
    ),
    totalCount: new Promise<number>((r) =>
      setTimeout(() => r(customersFixture.length), 200),
    ),
  });
};

export default function Index() {
  const loadData = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const { sortKey, sortOrder } = useSort({ defaultSortKey });

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 md:px-4 flex">
        <h1>顧客一覧</h1>
        <div className="flex-grow flex justify-end">
          <Link to="/customers/new">新規登録</Link>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col flex-grow overflow-hidden">
        {navigation.location?.pathname === "/customers" ? (
          <CustomerTable sortKey={sortKey} sortOrder={sortOrder} skeleton />
        ) : (
          <Suspense
            fallback={
              <CustomerTable sortKey={sortKey} sortOrder={sortOrder} skeleton />
            }
          >
            <Await resolve={loadData.customers}>
              {(resolvedValue) => (
                <CustomerTable
                  customers={resolvedValue}
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

type Customer = {
  fullName: string;
  fullNameKana: string;
  age: number;
  birthday: string;
  sex: string;
  blood: string;
  email: string;
  phoneNumber: string;
  mobilePhoneNumber: string;
  postNumber: string;
  address: string;
  company: string;
  note: string;
};

const headers = [
  { sortKey: "detailLink", label: "詳細", noSort: true },
  { sortKey: "fullName", label: "名前" },
  { sortKey: "address", label: "住所" },
  { sortKey: "phoneNumber", label: "電話番号" },
  { sortKey: "email", label: "メール" },
  { sortKey: "note", label: "備考" },
];
type CustomerTableProps = {
  skeleton?: false;
  customers: Customer[];
  sortKey: string;
  sortOrder: SortOrder;
};
type CustomerTableSkeletonProps = {
  skeleton: true;
  sortKey: string;
  sortOrder: SortOrder;
};
function CustomerTable(props: CustomerTableProps | CustomerTableSkeletonProps) {
  const customers = props.skeleton
    ? Array.from({ length: 10 }).map(() => {
        return {
          detailLink: <Skeleton className="h-4 w-8" />,
          fullName: <Skeleton className="h-4 w-20" />,
          address: <Skeleton className="h-4 w-40" />,
          phoneNumber: <Skeleton className="h-4 w-20" />,
          email: <Skeleton className="h-4 w-32" />,
          note: <Skeleton className="h-4 w-4" />,
        };
      })
    : props.customers.map((customer) => ({
        ...customer,
        detailLink: <Link to={`/customers/${customer.fullName}`}>詳細</Link>,
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
