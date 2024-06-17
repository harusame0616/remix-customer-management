import { Deal } from "../models/deal";
import { DealRepository } from "../usecases/repository";
import prisma from "~/lib/prisma";
export class PrismaDealRepository implements DealRepository {
  async save(deal: Deal): Promise<void> {
    const dto = deal.toDto();
    const common = {
      title: dto.title,
      content: dto.content,
      url: dto.url,
      registeredAt: dto.registeredAt,
      editedAt: dto.editedAt,
      platform: {
        connect: {
          dealPlatformId: dto.platformId,
        },
      },
      status: {
        connect: {
          dealStatusId: dto.statusId,
        },
      },
    };

    await prisma.deal.upsert({
      where: {
        dealId: dto.dealId,
      },
      update: {
        ...common,
        customer:
          dto.customerId === null
            ? {
                disconnect: true,
              }
            : {
                connect: {
                  customerId: dto.customerId,
                },
              },
      },
      create: {
        ...common,
        customer:
          dto.customerId === null
            ? undefined
            : {
                connect: {
                  customerId: dto.customerId,
                },
              },
      },
    });
  }

  async manyInsert(deals: Deal[]): Promise<void> {
    await prisma.deal.createMany({
      data: deals.map((deal) => deal.toDto()),
    });
  }

  async findByCustomerId(customerId: string): Promise<Deal[]> {
    const prismaDeals = await prisma.deal.findMany({
      where: {
        customerId,
      },
    });

    return prismaDeals.map((prismaDeal) =>
      Deal.fromDto({
        dealId: prismaDeal.dealId,
        title: prismaDeal.title,
        content: prismaDeal.content,
        url: prismaDeal.url,
        deadline: prismaDeal.deadline,
        attachments: prismaDeal.attachments,
        platformId: prismaDeal.platformId,
        statusId: prismaDeal.statusId,
        customerId: prismaDeal.customerId,
        registeredAt: prismaDeal.registeredAt,
        editedAt: prismaDeal.editedAt,
      }),
    );
  }

  async deleteById(dealId: string): Promise<void> {
    await prisma.deal.delete({
      where: {
        dealId,
      },
    });
  }

  async deleteAll(): Promise<void> {
    await prisma.deal.deleteMany();
  }
}
