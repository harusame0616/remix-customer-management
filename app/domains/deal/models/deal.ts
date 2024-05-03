export type DealDto = {
  dealId: string;
  title: string;
  content: string;
  url: string;
  deadline: Date | null;
  platformId: string;
  statusId: string;
  customerId: string | null;
  registeredAt: Date;
  editedAt: Date;
  attachments: string[];
};

export class Deal {
  dto: DealDto;

  protected constructor(dto: DealDto) {
    this.dto = { ...dto };
  }

  static fromDto(dto: DealDto) {
    return new Deal(dto);
  }

  toDto() {
    return { ...this.dto };
  }

  setCustomer(customer: string | null) {
    this.dto.customerId = customer;
  }
}
