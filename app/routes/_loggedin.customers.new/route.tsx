import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { type MetaFunction } from "@remix-run/node";
import { useActionData, useSubmit } from "@remix-run/react";
import React, { ComponentRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { ActionCard } from "~/components/action-card";
import { PageLayout } from "~/components/page-layout";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Form } from "~/components/ui/form";
import { Separator } from "~/components/ui/separator";
import { Sex } from "~/domains/customer/models/customer";
import { CustomerName } from "~/domains/customer/models/customer-name";
import {
  ADDRESS_MAX_LENGTH,
  addressSchema,
  birthdaySchema,
  EMAIL_MAX_LENGTH,
  emailSchema,
  MOBILE_PHONE_MAX_LENGTH,
  MOBILE_PHONE_MIN_LENGTH,
  mobilePhoneSchema,
  NAME_KANA_MAX_LENGTH,
  nameKanaSchema,
  nameSchema,
  NOTE_MAX_LENGTH,
  noteSchema,
  PHONE_MAX_LENGTH,
  PHONE_MIN_LENGTH,
  phoneSchema,
  POST_CODE_LENGTH,
  postCodeSchema,
  sexSchema,
  URL_MAX_LENGTH,
  urlSchema,
} from "~/domains/customer/schema";
import {
  FormInput,
  FormRadio,
  FormTextarea,
} from "../../components/form-input";
import { Action } from "./controllers";
export { action } from "./controllers";

export const meta: MetaFunction = () => {
  return [{ title: "顧客の新規登録 - 顧客管理システム" }];
};

const customerFormSchema = z.object({
  name: nameSchema(),
  nameKana: nameKanaSchema(),
  sex: sexSchema(),
  birthday: z.union([
    z.preprocess(
      (v) => (typeof v === "string" ? `${v}T00:00:00+09:00` : v),
      birthdaySchema(),
    ),
    z.literal("").transform(() => null),
  ]),
  phone: z.union([phoneSchema(), z.literal("")]),
  mobilePhone: z.union([mobilePhoneSchema(), z.literal("")]),
  postCode: z.union([postCodeSchema(), z.literal("")]),
  address: addressSchema(),
  url: z.union([urlSchema(), z.literal("")]),
  email: z.union([emailSchema(), z.literal("")]),
  note: noteSchema(),
});

type CustomerSchema = typeof customerFormSchema;
export default function CustomerNew() {
  const submit = useSubmit();
  const actionData = useActionData<Action>();
  const alertRef = React.useRef<ComponentRef<typeof Alert>>(null);

  useEffect(() => {
    if (actionData?.success !== false) {
      return;
    }

    alertRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [actionData]);

  const form = useForm<z.input<CustomerSchema>>({
    defaultValues: {
      address: "",
      birthday: "",
      email: "",
      name: "",
      nameKana: "",
      url: "",
      mobilePhone: "",
      phone: "",
      postCode: "",
      note: "",
      sex: Sex.Other,
    },
    resolver: zodResolver(customerFormSchema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    submit(JSON.stringify(data), {
      method: "POST",
      encType: "application/json",
    });
  });

  return (
    <PageLayout title="顧客の新規登録">
      <div className="flex flex-col flex-grow p-4 items-center overflow-auto">
        {actionData?.success === false && (
          <Alert
            variant="destructive"
            className="max-w-2xl w-full mb-4"
            ref={alertRef}
          >
            <ExclamationTriangleIcon aria-hidden />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{actionData.error.message}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form
            noValidate
            onSubmit={handleSubmit}
            className="max-w-2xl w-full space-y-4"
          >
            <ActionCard
              title={<h2>顧客情報</h2>}
              actionLabel="登録する"
              processingActonLabel="登録中です"
            >
              <FormInput
                control={form.control}
                description={`${CustomerName.MIN_LENGTH}文字以上、${CustomerName.MAX_LENGTH}文字以内`}
                label="名前"
                name="name"
                autoComplete="off"
                className="max-w-28"
                required
              />
              <FormInput
                control={form.control}
                label="名前（かな）"
                description={`${NAME_KANA_MAX_LENGTH}文字以内`}
                autoComplete="off"
                name="nameKana"
                className="max-w-48"
              />
              <FormRadio
                control={form.control}
                required
                selects={[
                  { label: "男性", value: Sex.Man },
                  { label: "女性", value: Sex.Woman },
                  { label: "その他", value: Sex.Other },
                  { label: "不明", value: Sex.Unknown },
                ]}
                label="性別"
                name="sex"
                className="max-w-28"
              />
              <FormInput
                control={form.control}
                label="誕生日"
                description="YYYY/MM/DD（例：1989/06/16）"
                name="birthday"
                type="date"
                autoComplete="off"
                className="max-w-36"
                max="9999-12-31"
              />
              <Separator />
              <FormInput
                control={form.control}
                label="メールアドレス"
                description={`${EMAIL_MAX_LENGTH} 文字以内`}
                type="email"
                autoComplete="off"
                name="email"
                className="max-w-80"
              />
              <FormInput
                control={form.control}
                description={`数字もしくはハイフンのみ入力可能です。ハイフンは自動で削除します。ハイフンを除いて ${PHONE_MIN_LENGTH} 文字以上 ${PHONE_MAX_LENGTH} 文字以内`}
                label="電話番号"
                type="tel"
                autoComplete="off"
                name="phone"
                className="max-w-36"
              />
              <FormInput
                control={form.control}
                description={`数字もしくはハイフンのみ入力可能です。ハイフンは自動で削除します。ハイフンを除いて ${MOBILE_PHONE_MIN_LENGTH} 文字以上 ${MOBILE_PHONE_MAX_LENGTH} 文字以内`}
                label="携帯電話番号"
                type="tel"
                autoComplete="off"
                name="mobilePhone"
                className="max-w-36"
              />
              <FormInput
                control={form.control}
                description={`${URL_MAX_LENGTH}文字以内`}
                autoComplete="off"
                label="URL"
                name="url"
                type="url"
                className="max-w-80"
              />
              <Separator />
              <FormInput
                autoComplete="off"
                control={form.control}
                description={`数字もしくはハイフンのみ入力可能です。ハイフンは自動で削除します。${POST_CODE_LENGTH} 文字`}
                inputMode="numeric"
                label="郵便番号"
                name="postCode"
                className="max-w-28"
              />
              <FormInput
                autoComplete="off"
                control={form.control}
                description={`${ADDRESS_MAX_LENGTH} 文字以内`}
                label="住所"
                name="address"
                className="max-w-96"
              />
              <Separator />
              <FormTextarea
                autoComplete="off"
                control={form.control}
                description={`${NOTE_MAX_LENGTH} 文字以内`}
                label="備考"
                name="note"
                rows={8}
              />
            </ActionCard>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
}
