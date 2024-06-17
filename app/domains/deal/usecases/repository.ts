import { Deal } from "../models/deal";

export interface DealRepository {
  manyInsert(deals: Deal[]): Promise<void>;
  save(deal: Deal | Deal[]): Promise<void>;
  deleteById(dealId: string): Promise<void>;
  findByCustomerId(customerId: string): Promise<Deal[]>;
  deleteAll(): Promise<void>;
}
