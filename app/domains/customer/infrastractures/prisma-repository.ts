import { Sex as PrismaSex } from "@prisma/client";
import prisma from "~/lib/prisma";
import { Customer, Sex } from "../models/customer";
import { CustomerRepository } from "../usecases/repository";

export function toPrismaSex(sex: Sex): PrismaSex {
  const prismaSexMap = {
    [Sex.Man]: PrismaSex.MAN,
    [Sex.Woman]: PrismaSex.WOMAN,
    [Sex.Other]: PrismaSex.OTHER,
    [Sex.Unknown]: PrismaSex.UNKNOWN,
  };

  return prismaSexMap[sex];
}
export class PrismaCustomerRepository implements CustomerRepository {
  async delete(customerId: string): Promise<void> {
    await prisma.customer.delete({
      where: {
        customerId,
      },
    });
  }
  async deleteAll(): Promise<void> {
    await prisma.customer.deleteMany();
  }

  async manyInsert(customers: Customer[]) {
    const customersDto = customers
      .map((customer) => customer.toDto())
      .map((customerDto) => ({
        ...customerDto,
        sex: toPrismaSex(customerDto.sex),
      }));

    await prisma.customer.createMany({ data: customersDto });
  }

  async save(customer: Customer) {
    const customerDto = customer.toDto();

    await prisma.customer.create({
      data: {
        ...customerDto,
        sex: toPrismaSex(customerDto.sex),
      },
    });
  }
}
