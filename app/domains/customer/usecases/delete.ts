import { DealRepository } from "../../deal/usecases/repository";
import { CustomerRepository } from "./repository";
import { Transactional } from "@transactional/core";

export class CustomerDeleteUsecase {
  constructor(
    private customerRepository: CustomerRepository,
    private dealRepository: DealRepository,
  ) {}

  @Transactional()
  async execute(id: string) {
    const deals = await this.dealRepository.findByCustomerId(id);

    for (const deal of deals) {
      deal.setCustomer(null);
    }

    const dealSavePromises = deals.map(this.dealRepository.save);
    await Promise.all(dealSavePromises);
    await this.customerRepository.delete(id);
  }
}
