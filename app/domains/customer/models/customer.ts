import { generateId } from "~/libs/id";

export const Sex = {
  Man: "man",
  Woman: "woman",
  Other: "other",
  Unknown: "unknown",
} as const;

export type Sex = (typeof Sex)[keyof typeof Sex];

export type CustomerDto = {
  customerId: string;
  name: string;
  nameKana: string;
  sex: Sex;
  birthday: string | null;
  phone: string;
  mobilePhone: string;
  postCode: string;
  address: string;
  url: string;
  email: string;
  note: string;
  registeredAt: string;
};

export type CustomerCreateParams = Omit<
  CustomerDto,
  "customerId" | "registeredAt"
>;

export class Customer {
  dto: CustomerDto;

  protected constructor(dto: CustomerDto) {
    this.dto = dto;
  }

  static create(params: CustomerCreateParams) {
    return new Customer({
      ...params,
      registeredAt: new Date().toISOString(),
      customerId: generateId(),
    });
  }
  fromDto(dto: CustomerDto) {
    this.dto = { ...dto };
  }

  toDto() {
    return { ...this.dto };
  }
}
