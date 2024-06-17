import { generateId } from "~/libs/id";

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

  static create(param: {
    title: string;
    content?: string;
    url?: string;
    deadline?: Date | null;
    platformId: string;
    statusId: string;
    customerId?: string | null;
  }) {
    return new Deal({
      ...param,
      dealId: generateId(),
      content: param.content || "",
      url: param.url || "",
      deadline: param.deadline || null,
      customerId: param.customerId || null,
      registeredAt: new Date(),
      editedAt: new Date(),
      attachments: [],
    });
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
