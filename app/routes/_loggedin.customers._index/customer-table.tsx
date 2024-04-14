import { Link } from "@remix-run/react";
import { Table } from "~/components/table";
import { Skeleton } from "~/components/ui/skeleton";
import { CustomerDto } from "~/domains/customer/models/customer";
import { SortOrder } from "~/lib/table";

const headers = [
  { sortKey: "detailLink", label: "詳細", noSort: true },
  { sortKey: "name", label: "名前" },
  { sortKey: "address", label: "住所" },
  { sortKey: "phone", label: "電話番号" },
  { sortKey: "email", label: "メール" },
];
type CustomerTableProps = {
  skeleton?: false;
  customers: Pick<
    CustomerDto,
    "customerId" | "name" | "address" | "phone" | "email"
  >[];
  sortKey: string;
  sortOrder: SortOrder;
};
type CustomerTableSkeletonProps = {
  skeleton: true;
  sortKey: string;
  sortOrder: SortOrder;
};
export function CustomerTable(
  props: CustomerTableProps | CustomerTableSkeletonProps,
) {
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
          <Link to={`/customers/${customer.customerId}`}>詳細</Link>
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
