import { DealRepository } from "./repository";

export class DealDeleteUsecase {
  constructor(private dealRepository: DealRepository) {}
  async execute(dealId: string) {
    await this.dealRepository.deleteById(dealId);
  }
}
