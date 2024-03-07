import { DealPlatform, DealStatus } from "~/domains/deal/enum";
import prisma from "~/lib/prisma";

async function main() {
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
