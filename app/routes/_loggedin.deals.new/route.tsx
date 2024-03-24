import {
  ActionFunctionArgs,
  json,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import z from "zod";
import { Separator } from "~/components/ui/separator";
import DealEditForm, {
  SubmitDeal,
} from "~/domains/deal/comopnents/deal-edit-form";
import {
  DEAL_CONTENT_MAX_LENGTH,
  DEAL_TITLE_MAX_LENGTH,
  DEAL_URL_MAX_LENGTH,
} from "~/domains/deal/constants";
import { dealPlatformIds, dealStatusIds } from "~/domains/deal/enum";
import prisma from "~/lib/prisma";

const pageTitle = "取引の新規登録";
export const meta: MetaFunction = () => {
  return [{ title: `${pageTitle} - 顧客管理システム` }];
};

const actionSchema = z.object({
  deal: z.object({
    title: z.string().max(DEAL_TITLE_MAX_LENGTH),
    content: z.string().max(DEAL_CONTENT_MAX_LENGTH),
    deadline: z.coerce.date().or(z.undefined()),
    statusId: z.enum(dealStatusIds),
    platformId: z.enum(dealPlatformIds),
    url: z.string().max(DEAL_URL_MAX_LENGTH),
  }),
});

export async function action({ request }: ActionFunctionArgs) {
  const actionParam = actionSchema.safeParse(await request.json());

  if (!actionParam.success) {
    console.error(JSON.stringify(actionParam.error, null, 4));

    throw new Response("パラメーターが不正です", { status: 400 });
  }

  try {
    const { dealId } = await prisma.deal.create({
      data: {
        title: actionParam.data.deal.title,
        content: actionParam.data.deal.content,
        deadline: actionParam.data.deal.deadline,
        status: { connect: { dealStatusId: actionParam.data.deal.statusId } },
        url: actionParam.data.deal.url,
        platform: {
          connect: { dealPlatformId: actionParam.data.deal.platformId },
        },
      },
    });
    return redirect(`/deals/${dealId}`);
  } catch (e) {
    console.error(JSON.stringify(e, null, 4));

    return json({ success: false, message: "取引の登録に失敗しました" });
  }
}

export default function Page() {
  const submit = useSubmit();

  async function handleSubmit(deal: SubmitDeal) {
    submit(JSON.stringify({ deal }), {
      method: "POST",
      encType: "application/json",
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 md:px-4 flex">
        <h1>{pageTitle}</h1>
      </div>
      <Separator />
      <div className="flex flex-col flex-grow px-4 items-center mt-4 overflow-auto">
        <DealEditForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
