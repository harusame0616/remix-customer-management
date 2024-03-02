import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, type MetaFunction } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { ActionCard } from "~/components/action-card";
import { Form } from "~/components/ui/form";
import { Separator } from "~/components/ui/separator";
import { FormInput, FormRadio } from "../components/form-input";

export const meta: MetaFunction = () => {
  return [{ title: "顧客の新規登録 - 顧客管理システム" }];
};

export const action = async () => {
  // TODO: not implement
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const id = crypto.randomUUID();
  return redirect(`/customers/${id}`);
};

const customerFormSchema = z.object({
  customerCode: z.string().max(32),
  fullName: z.string().max(12),
  fullNameKana: z
    .string()
    .max(32)
    .regex(/^[\u3040-\u309F]*$/, "ひらがなで入力してください"),
  birthday: z.coerce.date().or(z.literal("")),
  sex: z.enum(["man", "woman", "other", "unknown"]),
  emails: z.string().email().max(255).or(z.literal("")),
  phoneNumber: z.preprocess(
    (v) => (v as string).replace(/-/g, ""),
    z
      .string()
      .regex(/^\d+$/, "数字とハイフン以外が使われています")
      .min(9)
      .max(11)
      .or(z.literal(""))
  ),
  mobilePhoneNumber: z.preprocess(
    (v) => (v as string).replace(/-/g, ""),
    z
      .string()
      .regex(/^\d+$/, "数字とハイフン以外が使われています")
      .min(9)
      .max(11)
      .or(z.literal(""))
  ),
  postNumber: z.string().optional(),
  address: z.string().optional(),
  company: z.string().optional(),
});

type CustomerSchema = typeof customerFormSchema;
export default function CustomerNew() {
  const submit = useSubmit();
  const form = useForm<z.input<CustomerSchema>>({
    defaultValues: {
      sex: "unknown",
      address: "",
      birthday: "",
      company: "",
      customerCode: "",
      emails: "",
      fullName: "",
      fullNameKana: "",
      mobilePhoneNumber: "",
      phoneNumber: "",
      postNumber: "",
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
    <div className="flex flex-col h-full">
      <div className="p-2 md:px-4 flex">
        <h1>顧客の新規登録</h1>
      </div>
      <Separator />
      <div className="flex flex-col flex-grow px-4 items-center mt-4 overflow-auto">
        <Form {...form}>
          <form
            noValidate
            onSubmit={handleSubmit}
            className="max-w-2xl w-full space-y-4"
          >
            <ActionCard
              actionLabel="登録する"
              processingActonLabel="登録中です"
            >
              <FormInput
                control={form.control}
                label="顧客コード"
                description="32文字以内"
                name="customerCode"
                className="w-28"
              />
              <Separator />
              <FormInput
                control={form.control}
                description="12文字以内"
                label="名前"
                name="fullName"
                className="w-28"
              />
              <FormInput
                control={form.control}
                label="名前（かな）"
                description="32文字以内"
                name="fullNameKana"
                className="w-48"
              />
              <FormRadio
                control={form.control}
                selects={[
                  { label: "男性", value: "man" },
                  { label: "女性", value: "woman" },
                  { label: "その他", value: "unknown" },
                ]}
                label="性別"
                name="sex"
                className="w-28"
              />
              <FormInput
                control={form.control}
                label="誕生日"
                name="birthday"
                type="date"
                className="w-32"
                max="9999-12-31"
              />

              <Separator />

              <FormInput
                control={form.control}
                label="メールアドレス"
                description="255文字以内"
                name="emails"
                className="w-80"
              />
              <FormInput
                control={form.control}
                description="ハイフンは自動で削除します。ハイフンを除いて9文字以上11文字以内"
                label="電話番号"
                name="phoneNumber"
                className="w-40"
              />
              <FormInput
                control={form.control}
                description="ハイフンは自動で削除します。ハイフンを除いて9文字以上11文字以内"
                label="携帯電話番号"
                name="mobilePhoneNumber"
                className="w-40"
              />

              <Separator />

              <FormInput
                control={form.control}
                label="郵便番号"
                name="postNumber"
                className="w-24"
              />
              <FormInput
                control={form.control}
                label="住所"
                name="address"
                className="w-80"
              />
            </ActionCard>
          </form>
        </Form>
      </div>
    </div>
  );
}
