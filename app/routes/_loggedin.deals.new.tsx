import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, type MetaFunction } from "@remix-run/node";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { ActionCard } from "~/components/action-card";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { Separator } from "~/components/ui/separator";
import {
  DEAL_ATTACHMENT_NAME_MAX_LENGTH,
  DEAL_CONTENT_MAX_LENGTH,
  DEAL_TITLE_MAX_LENGTH,
  DEAL_URL_MAX_LENGTH,
} from "~/domains/deal/constants";
import { dealStatusIds, dealStatuses } from "~/domains/deal/enum";
import { FormInput, FormRadio, FormTextarea } from "../components/form-input";

const pageTitle = "取引の新規登録";
export const meta: MetaFunction = () => {
  return [{ title: `${pageTitle} - 顧客管理システム` }];
};

export const action = async () => {
  // TODO: not implement
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const id = crypto.randomUUID();
  return redirect(`/deals/${id}`);
};

export default function Page() {
  const formSchema = z.object({
    title: z.string().max(DEAL_TITLE_MAX_LENGTH),
    content: z.string().max(DEAL_CONTENT_MAX_LENGTH),
    deadline: z.coerce.date().or(z.literal("")),
    status: z.enum(dealStatusIds),
    url: z.string().max(DEAL_URL_MAX_LENGTH),
    attachments: z.array(
      z.object({
        name: z.string().max(DEAL_ATTACHMENT_NAME_MAX_LENGTH),
      }),
    ),
  });
  type CustomerSchema = typeof formSchema;

  const form = useForm<z.input<CustomerSchema>>({
    defaultValues: {
      title: "",
      content: "",
      deadline: "",
      attachments: [{ name: "" }],
      url: "",
      status: dealStatusIds[0],
    },
    resolver: zodResolver(formSchema),
  });

  const attachments = useFieldArray({
    control: form.control,
    name: "attachments",
  });

  const handleSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 md:px-4 flex">
        <h1>{pageTitle}</h1>
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
                label="タイトル"
                description="32文字以内"
                name="title"
                required
              />
              <FormTextarea
                control={form.control}
                description="12文字以内"
                rows={9}
                label="取引内容"
                name="content"
              />
              <FormInput
                control={form.control}
                label="URL"
                type="url"
                name="url"
              />
              <FormInput
                control={form.control}
                label="締め切り"
                description="32文字以内"
                name="deadline"
                type="date"
                className="max-w-48"
              />
              <FormRadio
                control={form.control}
                selects={dealStatuses.map((status) => ({
                  value: status.dealStatusId,
                  label: status.label,
                }))}
                label="ステータス"
                name="status"
                className="max-w-28"
              />
              <Separator />
              <div className="space-y-2">
                {attachments.fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2">
                    <div className="flex-grow">
                      <FormInput
                        control={form.control}
                        label="添付ファイル"
                        type="file"
                        name={`attachments.${index}.name`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        attachments.remove(index);
                      }}
                      size="input"
                    >
                      削除
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => {
                    attachments.append({ name: "" });
                  }}
                  variant="outline"
                >
                  添付ファイル追加
                </Button>
              </div>
            </ActionCard>
          </form>
        </Form>
      </div>
    </div>
  );
}