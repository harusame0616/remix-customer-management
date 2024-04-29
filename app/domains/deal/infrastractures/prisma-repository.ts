import { DealRepository } from "../usecases/repository";
import prisma from "~/lib/prisma";

export class PrismaDealRepository implements DealRepository {
  async deleteById(dealId: string): Promise<void> {
    await prisma.deal.delete({
      where: {
        dealId,
      },
    });
  }
}
