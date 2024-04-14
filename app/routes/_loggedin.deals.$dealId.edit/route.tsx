import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  json,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import { Await, useLoaderData, useSubmit } from "@remix-run/react";
import { ComponentProps, Suspense } from "react";
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
import {
  DealPlatformId,
  DealStatusId,
  dealPlatformIds,
  dealStatusIds,
} from "~/domains/deal/enum";
import prisma from "~/lib/prisma";

const pageTitle = "取引の編集";
export const meta: MetaFunction = () => {
  return [{ title: `${pageTitle} - 顧客管理システム` }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.dealId) {
    console.error("dealId is required");
    throw new Response("Bad Request", { status: 400 });
  }

  return defer({
    dealDetail: new Promise<
      Exclude<ComponentProps<typeof DealEditForm>["deal"], undefined>
    >((resolve, reject) =>
      prisma.deal
        .findUnique({
          where: { dealId: params.dealId },
          select: {
            title: true,
            content: true,
            url: true,
            deadline: true,
            statusId: true,
            platformId: true,
            customer: { select: { customerId: true, name: true } },
          },
        })
        .then((data) => {
          if (!data) {
            return reject(new Error("error"));
          }

          resolve({
            title: data.title,
            content: data.content,
            url: data.url,
            deadline: data.deadline ?? undefined,
            statusId: data.statusId as DealStatusId,
            platformId: data.platformId as DealPlatformId,
            customer: data.customer ?? undefined,
          });
        }),
    ),
  });
}

const actionSchema = z.object({
  deal: z.object({
    title: z.string().max(DEAL_TITLE_MAX_LENGTH),
    content: z.string().max(DEAL_CONTENT_MAX_LENGTH),
    deadline: z.coerce.date().or(z.undefined()),
    statusId: z.enum(dealStatusIds),
    platformId: z.enum(dealPlatformIds),
    url: z.string().max(DEAL_URL_MAX_LENGTH),
    customerId: z.string().optional(),
  }),
});
export async function action({ request, params }: ActionFunctionArgs) {
  if (!params.dealId) {
    throw new Response("Bad Request", { status: 400 });
  }

  const actionParam = actionSchema.safeParse(await request.json());
  if (!actionParam.success) {
    console.error(JSON.stringify(actionParam.error, null, 4));
    throw new Response("Bad Request", { status: 400 });
  }

  try {
    const { dealId } = await prisma.deal.update({
      where: { dealId: params.dealId },
      data: {
        title: actionParam.data.deal.title,
        content: actionParam.data.deal.content,
        deadline: actionParam.data.deal.deadline,
        status: { connect: { dealStatusId: actionParam.data.deal.statusId } },
        platform: {
          connect: { dealPlatformId: actionParam.data.deal.platformId },
        },
        url: actionParam.data.deal.url,
        customer: actionParam.data.deal.customerId
          ? { connect: { customerId: actionParam.data.deal.customerId } }
          : { disconnect: true },
      },
    });

    return redirect(`/deals/${dealId}`);
  } catch (e) {
    console.error(JSON.stringify(e, null, 4));

    return json({ success: false, message: "取引の編集に失敗しました" });
  }
}

export default function Page() {
  const submit = useSubmit();
  const loadData = useLoaderData<typeof loader>();

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
        <Suspense>
          <Await resolve={loadData.dealDetail}>
            {(deal) => (
              <DealEditForm
                onSubmit={handleSubmit}
                deal={{
                  ...deal,
                  deadline: deal.deadline ? new Date(deal.deadline) : undefined,
                }}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
