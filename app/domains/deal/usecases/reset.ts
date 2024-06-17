import { Deal } from "../models/deal";
import { dummyDeals } from "./dummy-deals";
import { DealRepository } from "./repository";

export class DealResetUsecase {
  constructor(private dealRepository: DealRepository) {}
  async execute(customerIds: string[]): Promise<void> {
    await this.dealRepository.deleteAll();

    const deals = dummyDeals.map((deal, i) =>
      Deal.create({
        ...deal,
        customerId: customerIds[i] || null,
        deadline: null,
      }),
    );

    await this.dealRepository.manyInsert(deals);
  }
}
