import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { PrismaCustomerRepository } from "~/domains/customer/infrastractures/prisma-repository";
import { CustomerCreateUsecase } from "~/domains/customer/usecases/create";

import { z } from "zod";
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
export async function createCustomerController({
  request,
}: ActionFunctionArgs) {
  const parsedParams = createCustomerSchema.safeParse(await request.json());

  if (!parsedParams.success) {
    return json({
      success: false,
      error: { message: "パラメーターが不正です" },
    });
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
