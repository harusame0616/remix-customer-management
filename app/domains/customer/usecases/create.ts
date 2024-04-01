import { Customer, CustomerCreateParams } from "../models/customer";
import { CustomerRepository } from "./repository";

export class CustomerCreateUsecase {
  constructor(private customerRepository: CustomerRepository) {}
  async execute(params: CustomerCreateParams) {
    const customer = Customer.create(params);
    await this.customerRepository.save(customer);

    return customer.toDto();
  }
}
