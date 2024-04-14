import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { UseFormHandleSubmit, useForm } from "react-hook-form";
import z, { union } from "zod";
import { ActionCard } from "~/components/action-card";
import { Form } from "~/components/ui/form";
import {
  DealPlatformId,
  DealStatusId,
  dealPlatformIds,
  dealPlatforms,
  dealStatusIds,
  dealStatuses,
} from "~/domains/deal/enum";
import {
  FormInput,
  FormRadio,
  FormTextarea,
} from "../../../components/form-input";
import {
  DEAL_CONTENT_MAX_LENGTH,
  DEAL_TITLE_MAX_LENGTH,
  DEAL_URL_MAX_LENGTH,
} from "../constants";
import { Separator } from "~/components/ui/separator";
import { CustomerSelectDialog } from "~/components/customer-select-dialog";
import { CustomerDto } from "~/domains/customer/models/customer";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(1).max(DEAL_TITLE_MAX_LENGTH),
  content: z.string().max(DEAL_CONTENT_MAX_LENGTH),
  deadline: z.union([
    z.literal("").transform(() => undefined),
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .transform((v) => new Date(v)),
  ]),
  statusId: z.enum(dealStatusIds),
  platformId: z.enum(dealPlatformIds),
  url: union([z.string().url().max(DEAL_URL_MAX_LENGTH), z.literal("")]),
  customerId: union([z.literal("").transform(() => undefined), z.string()]),
});
type FormSchema = typeof formSchema;
export type SubmitDeal = z.output<FormSchema>;

type DealEditFormProps = {
  onSubmit: (data: SubmitDeal) => Promise<void>;
  deal?: {
    title: string;
    content: string;
    deadline?: Date;
    url: string;
    platformId: DealPlatformId;
    statusId: DealStatusId;
    customer?: Pick<CustomerDto, "customerId" | "name">;
  };
};

export default function DealEditForm({ onSubmit, deal }: DealEditFormProps) {
  const [customer, setCustomer] = useState<
    | {
        customerId: string;
        name: string;
      }
    | undefined
  >(deal?.customer);
  const form = useForm<z.input<FormSchema>>({
    defaultValues: {
      title: deal?.title || "",
      content: deal?.content || "",
      deadline: deal?.deadline ? format(deal.deadline, "yyyy-MM-dd") : "",
      url: deal?.url || "",
      platformId: deal?.platformId || dealPlatformIds[0],
      statusId: deal?.statusId || dealStatusIds[0],
      customerId: deal?.customer?.customerId || "",
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form
        noValidate
        className="max-w-2xl w-full space-y-4"
        onSubmit={
          // ShadCN が transformedValue に対応していないため強制的に型を変換
          (
            form.handleSubmit as unknown as UseFormHandleSubmit<
              z.input<FormSchema>,
              SubmitDeal
            >
          )(onSubmit)
        }
      >
        <ActionCard
          actionLabel={deal ? "編集する" : "登録する"}
          processingActonLabel={deal ? "編集中です" : "登録中です"}
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
          <FormInput control={form.control} label="URL" type="url" name="url" />
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
            selects={dealPlatforms.map((status) => ({
              value: status.dealPlatformId,
              label: status.label,
            }))}
            label="プラットフォーム"
            name="platformId"
            className="max-w-28"
          />
          <FormRadio
            control={form.control}
            selects={dealStatuses.map((status) => ({
              value: status.dealStatusId,
              label: status.label,
            }))}
            label="ステータス"
            name="statusId"
            className="max-w-28"
          />
          <Separator />
          <div className="flex flex-col gap-2">
            <div>
              顧客：
              {customer?.name === undefined
                ? "未選択"
                : customer.name || "（名前未設定）"}
            </div>
            <div>
              <CustomerSelectDialog
                onSelect={function (
                  customer: Pick<CustomerDto, "customerId" | "name">,
                ): void {
                  form.setValue("customerId", customer.customerId);
                  setCustomer(customer);
                }}
              />
            </div>
          </div>
        </ActionCard>
      </form>
    </Form>
  );
}
