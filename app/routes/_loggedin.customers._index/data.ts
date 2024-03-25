import { PER_PAGE } from "~/lib/pagination";
import prisma from "~/lib/prisma";
import { SortOrder } from "~/lib/table";

type GetCustomersArg = {
  sortKey: string;
  sortOrder: SortOrder;
  page: number;
  condition: Record<string, unknown>;
};
export async function getCustomers({
  sortKey,
  sortOrder,
  page,
  condition,
}: GetCustomersArg) {
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

type GetCustomersTotalCountArg = {
  condition: Record<string, unknown>;
};
export async function getCustomerTotalCount({
  condition,
}: GetCustomersTotalCountArg) {
  return await prisma.customer.count({ where: condition });
}
