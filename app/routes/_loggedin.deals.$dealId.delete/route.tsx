import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import z from "zod";
import { PrismaDealRepository } from "~/domains/deal/infrastractures/prisma-repository";
import { DealDeleteUsecase } from "~/domains/deal/usecases/delete";

const paramsSchema = z.object({
  dealId: z.string().min(1),
});
export const action = async ({ params }: ActionFunctionArgs) => {
  const parsedParams = paramsSchema.safeParse(params);

  if (!parsedParams.success) {
    return json({ success: false, error: parsedParams.error }, { status: 400 });
  }

  const dealDeleteUsecase = new DealDeleteUsecase(new PrismaDealRepository());
  await dealDeleteUsecase.execute(parsedParams.data.dealId);

  return redirect("/deals");
};
