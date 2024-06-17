import { json } from "@remix-run/react";
import { PrismaDealRepository } from "~/domains/deal/infrastractures/prisma-repository";
import { bathAuthLoaderMiddleware } from "~/lib/batch";
import { PrismaCustomerRepository } from "../../domains/customer/infrastractures/prisma-repository";
import { CustomerResetUsecase } from "../../domains/customer/usecases/reset";
import { DealResetUsecase } from "../../domains/deal/usecases/reset";

export const loader = bathAuthLoaderMiddleware(async () => {
  const customerReset = new CustomerResetUsecase(
    new PrismaCustomerRepository(),
  );
  const dealResetUsecase = new DealResetUsecase(new PrismaDealRepository());

  const customers = await customerReset.execute();
  await dealResetUsecase.execute(customers.map(({ customerId }) => customerId));

  return json({ success: true });
});

export type Loader = typeof loader;
