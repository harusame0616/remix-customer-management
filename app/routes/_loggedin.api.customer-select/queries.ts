import { PER_PAGE } from "~/lib/pagination";
import prisma from "~/lib/prisma";
import { SortOrder } from "~/lib/table";

type Condition = {
  keyword?: string;
};

function createWhere(condition: Condition) {
  return {
    OR: condition.keyword
      ? [
          { name: { contains: condition.keyword } },
          { nameKana: { contains: condition.keyword } },
          { address: { contains: condition.keyword } },
          { note: { contains: condition.keyword } },
        ]
      : undefined,
  };
}

type QueryCustomersArg = {
  sortKey: string;
  sortOrder: SortOrder;
  page: number;
  condition: Condition;
};
export async function queryCustomers({
  sortKey,
  sortOrder,
  page,
  condition,
}: QueryCustomersArg) {
  return await prisma.customer.findMany({
    select: {
      customerId: true,
      name: true,
    },
    orderBy: {
      [sortKey]: sortOrder,
    },
    where: createWhere(condition),
    take: PER_PAGE,
    skip: (page - 1) * PER_PAGE,
  });
}

type QueryCustomerTotalCountArg = {
  condition: Condition;
};
export async function queryCustomerTotalCount({
  condition,
}: QueryCustomerTotalCountArg) {
  return await prisma.customer.count({
    where: createWhere(condition),
  });
}
