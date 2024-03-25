import { createCustomerFixtures } from "e2e/customers/fixtures";
import { createDealFixtures } from "e2e/deals/fixtures";
import { DealPlatform, DealStatus } from "~/domains/deal/enum";
import prisma from "~/lib/prisma";

async function main() {
  await prisma.deal.deleteMany();
  await prisma.customer.deleteMany();

  await Promise.all([
    prisma.dealStatus.deleteMany(),
    prisma.dealPlatform.deleteMany(),
  ]);

  await Promise.all([
    prisma.dealStatus.createMany({
      data: Object.values(DealStatus),
    }),
    prisma.dealPlatform.createMany({
      data: Object.values(DealPlatform),
    }),
  ]);

  await prisma.deal.createMany({
    data: createDealFixtures(),
  });
  await prisma.customer.createMany({
    data: createCustomerFixtures(),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
