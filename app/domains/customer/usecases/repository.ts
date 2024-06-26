import { Customer } from "../models/customer";

export interface CustomerRepository {
  save(customer: Customer): Promise<void>;
  delete(customerId: string): Promise<void>;
}
