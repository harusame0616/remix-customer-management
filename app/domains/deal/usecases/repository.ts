import { Deal } from "../models/deal";

export interface DealRepository {
  save(deal: Deal | Deal[]): Promise<void>;
  deleteById(dealId: string): Promise<void>;
  findByCustomerId(customerId: string): Promise<Deal[]>;
}
