import {
  defer,
  json,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Await, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { Suspense } from "react";
import { z } from "zod";
import { ListPageLayout } from "~/components/list-page-layout";
import { Table } from "~/components/table";
import { Skeleton } from "~/components/ui/skeleton";
import { useSort } from "~/hooks/use-sort";
import { safeParseQueryString } from "~/lib/search-params";
import { SortOrder } from "~/lib/table";
import { getCustomers, getCustomerTotalCount } from "./data";

const defaultSortKey = "name";
export const meta: MetaFunction = () => {
  return [{ title: "顧客一覧 - 顧客管理システム" }];
};

function parseGetSearchParams(source: string | URL) {
  const queryString = source instanceof URL ? source.search : source.toString();

  return safeParseQueryString(
    queryString,
    z.object({
      page: z.coerce.number().optional().default(1),
      sortKey: z.string().optional().default(defaultSortKey),
      sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
    }),
  );
}
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const loaderParams = parseGetSearchParams(new URL(request.url));

  if (!loaderParams.success) {
    return json(loaderParams);
  }

  return defer({
    success: true,
    customers: getCustomers({
      sortKey: loaderParams.data.sortKey,
      sortOrder: loaderParams.data.sortOrder,
      page: loaderParams.data.page,
      condition: {},
    }),
    totalCount: getCustomerTotalCount({ condition: {} }),
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
      title="顧客一覧"
      totalCount={loadData.totalCount}
      toolbarItems={[
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

type Customer = {
  name: string;
  nameKana: string;
  sex: string;
  birthday?: string;
  phone: string;
  email: string;
  mobilePhone: string;
  postCode: string;
  address: string;
  note: string;
};

const headers = [
  { sortKey: "detailLink", label: "詳細", noSort: true },
  { sortKey: "name", label: "名前" },
  { sortKey: "address", label: "住所" },
  { sortKey: "phone", label: "電話番号" },
  { sortKey: "email", label: "メール" },
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
          name: <Skeleton className="h-4 w-20" />,
          address: <Skeleton className="h-4 w-40" />,
          phoneNumber: <Skeleton className="h-4 w-20" />,
          email: <Skeleton className="h-4 w-32" />,
        };
      })
    : props.customers.map((customer) => ({
        ...customer,
        email: customer.email ? (
          <a href={`mailto:${customer.email}`}>{customer.email}</a>
        ) : (
          "-"
        ),
        phone: customer.phone ? (
          <a href={`tel:${customer.phone}`}>{customer.phone}</a>
        ) : (
          "-"
        ),
        detailLink: customer.name ? (
          <Link to={`/customers/${customer.name}`}>詳細</Link>
        ) : (
          "-"
        ),
      }));

  return (
    <Table
      rows={customers}
      headers={headers}
      currentSortKey={props.sortKey}
      sortOrder={props.sortOrder}
    />
  );
}
