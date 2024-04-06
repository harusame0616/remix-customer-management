import prisma from "~/lib/prisma";

export async function queryCustomer(id: string) {
  const customer = await prisma.customer.findUnique({
    select: { name: true },
    where: { customerId: id },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
}
