import { Transactional } from "@transactional/core";
import { Customer } from "../models/customer";
import { dummyCustomers } from "./dummy-customers";
import { CustomerRepository } from "./repository";

export class CustomerResetUsecase {
  constructor(private customerRepository: CustomerRepository) {}
  @Transactional()
  async execute() {
    await this.customerRepository.deleteAll();

    const customers = dummyCustomers.map(Customer.create);
    await this.customerRepository.manyInsert(customers);

    return customers.map((customer) => customer.toDto());
  }
}
