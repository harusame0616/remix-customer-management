export interface DealRepository {
  deleteById(dealId: string): Promise<void>;
}
