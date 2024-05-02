import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import z from "zod";
import { ErrorMessage } from "~/components/error-message";
import { PrismaCustomerRepository } from "~/domains/customer/infrastractures/prisma-repository";
import { CustomerDeleteUsecase } from "~/domains/customer/usecases/delete";
import { PrismaDealRepository } from "~/domains/deal/infrastractures/prisma-repository";

const paramsSchema = z.object({
  customerId: z.string().min(1),
});
export const action = async ({ params }: ActionFunctionArgs) => {
  const parsedParams = paramsSchema.safeParse(params);

  if (!parsedParams.success) {
    return json({ success: false, error: parsedParams.error }, { status: 400 });
  }

  const customerDeleteUsecase = new CustomerDeleteUsecase(
    new PrismaCustomerRepository(),
    new PrismaDealRepository(),
  );

  try {
    await customerDeleteUsecase.execute(parsedParams.data.customerId);
  } catch (error: unknown) {
    return json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }

  return redirect("/customers");
};

export default function Page() {
  const data = useActionData<typeof action>();

  if (!data?.success) {
    return (
      <div className="p-8">
        <ErrorMessage message="削除に失敗しました。" />
        <div className="flex justify-center">
          <Link to="../">戻る</Link>
        </div>
      </div>
    );
  }

  return null;
}
