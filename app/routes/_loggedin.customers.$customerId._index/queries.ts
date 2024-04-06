import prisma from "~/lib/prisma";
import { toDomainSex } from "~/lib/sex";

export async function queryCustomer(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { customerId: id },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return {
    ...customer,
    sex: toDomainSex(customer.sex),
  };
}
