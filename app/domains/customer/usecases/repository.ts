import { Customer } from "../models/customer";

export interface CustomerRepository {
  save(customers: Customer): Promise<void>;
  manyInsert(customers: Customer[]): Promise<void>;
  delete(customerId: string): Promise<void>;
  deleteAll(): Promise<void>;
}
