import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs, defer, type MetaFunction } from "@remix-run/node";
import { Await, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { Suspense } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadCNPagination,
} from "~/components/ui/pagination";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { customersFixture } from "~/fixtures/customers";
import { usePagination } from "~/hooks/use-pagination";
import { useSort } from "~/hooks/use-sort";
import { PER_PAGE, toPage } from "~/lib/pagination";
import { SortOrder } from "~/lib/table";

export const meta: MetaFunction = () => {
  return [{ title: "顧客一覧 - 顧客管理システム" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const page = Number(new URL(request.url).searchParams.get("page"));

  const offset = (page - 1) * PER_PAGE;
  const customers = customersFixture
    .slice(offset, offset + PER_PAGE)
    .map((customer) => ({ ...customer, note: "" }));

  return defer({
    customers: new Promise<typeof customers>((r) =>
      setTimeout(() => r(customers), 1000)
    ),
    totalCount: new Promise<number>((r) =>
      setTimeout(() => r(customersFixture.length), 200)
    ),
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
          <Link to="/customers/new">新規登録</Link>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col flex-grow overflow-hidden">
        {navigation.location ? (
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
          {(totalCount) => <Pagination totalCount={totalCount} />}
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
          fullName: <Skeleton className="h-4 w-20" />,
          address: <Skeleton className="h-4 w-40" />,
          phoneNumber: <Skeleton className="h-4 w-20" />,
          email: <Skeleton className="h-4 w-32" />,
          note: <Skeleton className="h-4 w-4" />,
        };
      })
    : props.customers;
  return (
    <Table className="overflow-auto min-w-[640px]">
      <TableHeader className="sticky top-0 bg-background drop-shadow-sm ">
        <TableRow>
          {headers.map(({ sortKey, label }) => (
            <HeaderItem key={sortKey} sortKey={sortKey} label={label} />
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer, index) => (
          <TableRow key={index}>
            <TableCell>{customer.fullName}</TableCell>
            <TableCell>{customer.address}</TableCell>
            <TableCell>{customer.phoneNumber}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

type HeaderItemProps = {
  sortKey: string;
  label: string;
};
function HeaderItem({ sortKey, label }: HeaderItemProps) {
  const { changeSort, sortOrder, sortKey: currentSortKey } = useSort();
  return (
    <TableHead>
      <Button
        onClick={() => changeSort(sortKey)}
        variant="ghost"
        className="w-full text-left p-0 flex justify-start font-bold"
      >
        <span className="mr-2">{label}</span>
        {currentSortKey === sortKey && <SortIcon sort={sortOrder} />}
      </Button>
    </TableHead>
  );
}

function SortIcon({ sort }: { sort: SortOrder }) {
  return sort === SortOrder.Asc ? (
    <ChevronDownIcon className="降順" />
  ) : (
    <ChevronUpIcon className="昇順" />
  );
}

type PaginationProps = { totalCount: number };
function Pagination({ totalCount }: PaginationProps) {
  const { currentPage, nextUrl, goToPage, prevUrl, totalPage } =
    usePagination(totalCount);

  return (
    <div className="flex justify-end gap-8 px-8">
      <div>
        <ShadCNPagination className="py-1">
          <PaginationContent className="flex">
            {prevUrl && (
              <PaginationItem>
                <PaginationPrevious to={prevUrl} />
              </PaginationItem>
            )}
            {nextUrl && (
              <PaginationItem>
                <PaginationNext to={nextUrl} />
              </PaginationItem>
            )}
          </PaginationContent>
        </ShadCNPagination>
      </div>
      <div className="flex items-center">全 {totalPage}ページ</div>
      <form
        className="flex items-center gap-2"
        method="GET"
        onSubmit={(e) => {
          e.preventDefault();
          const page = new FormData(e.target as HTMLFormElement).get("page");
          goToPage(toPage(page));
        }}
      >
        <Input
          defaultValue={currentPage}
          type="number"
          name="page"
          min={1}
          required
          max={totalPage}
          className="w-24"
        />
        ページ目へ
        <Button variant="outline">移動</Button>
      </form>
    </div>
  );
}
