import { PER_PAGE } from "~/lib/pagination";
import prisma from "~/lib/prisma";
import { SortOrder } from "~/lib/table";

type QueryCustomersArg = {
  sortKey: string;
  sortOrder: SortOrder;
  page: number;
  condition: Record<string, unknown>;
};
export async function queryCustomers({
  sortKey,
  sortOrder,
  page,
  condition,
}: QueryCustomersArg) {
  const customers = await prisma.customer.findMany({
    orderBy: {
      [sortKey]: sortOrder,
    },
    where: condition,
    take: PER_PAGE,
    skip: (page - 1) * PER_PAGE,
  });

  return customers.map((customer) => ({
    ...customer,
    birthday: customer.birthday ? customer.birthday : undefined,
  }));
}

type QueryCustomerTotalCountArg = {
  condition: Record<string, unknown>;
};
export async function queryCustomerTotalCount({
  condition,
}: QueryCustomerTotalCountArg) {
  return await prisma.customer.count({ where: condition });
}
