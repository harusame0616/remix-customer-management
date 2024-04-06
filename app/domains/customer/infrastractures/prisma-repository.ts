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
