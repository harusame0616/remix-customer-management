import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { PrismaCustomerRepository } from "~/domains/customer/infrastractures/prisma-repository";
import { CustomerCreateUsecase } from "~/domains/customer/usecases/create";

import { z } from "zod";
import { Role } from "~/domains/auth-user/roles";
import {
  addressSchema,
  birthdaySchema,
  emailSchema,
  mobilePhoneSchema,
  nameKanaSchema,
  nameSchema,
  noteSchema,
  phoneSchema,
  postCodeSchema,
  sexSchema,
  urlSchema,
} from "~/domains/customer/schema";
import { getRole, haveAuthorization } from "~/lib/auth";

const createCustomerSchema = z.object({
  name: nameSchema(),
  nameKana: nameKanaSchema(),
  sex: sexSchema(),
  birthday: z.union([birthdaySchema(), z.null()]),
  phone: z.union([phoneSchema(), z.literal("")]),
  mobilePhone: z.union([mobilePhoneSchema(), z.literal("")]),
  postCode: z.union([postCodeSchema(), z.literal("")]),
  address: addressSchema(),
  url: z.union([urlSchema(), z.literal("")]),
  email: z.union([emailSchema(), z.literal("")]),
  note: noteSchema(),
});
export async function action({ request }: ActionFunctionArgs) {
  const parsedParams = createCustomerSchema.safeParse(await request.json());

  if (!parsedParams.success) {
    return json({
      success: false,
      error: { message: "パラメーターが不正です" },
    });
  }

  const role = await getRole(request);
  if (!haveAuthorization([Role.Admin, Role.Editor], role)) {
    throw new Response("Forbidden", { status: 403 });
  }

  try {
    const usecase = new CustomerCreateUsecase(new PrismaCustomerRepository());
    const { customerId } = await usecase.execute(parsedParams.data);
    return redirect(`/customers/${customerId}`);
  } catch (e) {
    return json({
      success: false,
      error: { message: "保存に失敗しました" },
    });
  }
}

export type Action = typeof action;
