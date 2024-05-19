import { generateId } from "~/libs/id";
import { CustomerName } from "./customer-name";

export const Sex = {
  Man: "man",
  Woman: "woman",
  Other: "other",
  Unknown: "unknown",
} as const;

export type Sex = (typeof Sex)[keyof typeof Sex];

type CustomerProperty = {
  customerId: string;
  name: CustomerName;
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

export type CustomerDto = Omit<CustomerProperty, "name"> & { name: string };

export type CustomerCreateParams = Omit<
  CustomerProperty,
  "customerId" | "registeredAt" | "name"
> & { name: string };

export class Customer {
  protected constructor(private property: CustomerProperty) {}

  static create(params: CustomerCreateParams) {
    return new Customer({
      ...params,
      name: CustomerName.create(params.name),
      registeredAt: new Date().toISOString(),
      customerId: generateId(),
    });
  }
  static fromDto(dto: CustomerDto) {
    return new Customer({
      ...dto,
      name: CustomerName.fromDto(dto),
    });
  }
  toDto(): CustomerDto {
    return {
      ...this.property,
      name: this.property.name.value,
    };
  }
}
