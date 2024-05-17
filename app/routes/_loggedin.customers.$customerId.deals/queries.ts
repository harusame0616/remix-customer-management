import { DealListItem } from "~/domains/deal/comopnents/deal-table";
import { DealPlatformId, DealStatusId } from "~/domains/deal/enum";
import { PER_PAGE } from "~/lib/pagination";
import prisma from "~/lib/prisma";

type Params = {
  sortKey: string;
  sortOrder: string;
  page: number;
  condition: {
    keyword?: string;
    deadlineFrom?: Date;
    deadlineTo?: Date;
    statusId?: DealStatusId[];
    platformId?: DealPlatformId[];
  };
};
export async function getDealsByCustomerId(
  customerId: string,
  { sortKey, sortOrder, page, condition }: Params,
) {
  return new Promise<DealListItem[]>((resolve) => {
    prisma.deal
      .findMany({
        where: {
          customerId,
          OR: condition.keyword
            ? [
                {
                  title: {
                    contains: condition.keyword,
                  },
                },
                {
                  content: {
                    contains: condition.keyword,
                  },
                },
              ]
            : undefined,
          statusId: {
            in: condition.statusId,
          },
          platformId: {
            in: condition.platformId,
          },
          deadline: {
            gte: condition.deadlineFrom ? condition.deadlineFrom : undefined,
            lte: condition.deadlineTo ? condition.deadlineTo : undefined,
          },
        },
        orderBy: {
          [sortKey]: sortOrder,
        },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      })
      .then((deals) =>
        resolve(
          deals.map((deal) => ({
            dealId: deal.dealId,
            title: deal.title,
            statusId: deal.statusId as DealStatusId,
            deadline: deal.deadline ? deal.deadline : undefined,
            registeredAt: deal.registeredAt,
            editedAt: deal.editedAt,
          })),
        ),
      );
  });
}
