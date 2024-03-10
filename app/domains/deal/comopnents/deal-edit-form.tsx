import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormHandleSubmit, useForm } from "react-hook-form";
import z from "zod";
import { ActionCard } from "~/components/action-card";
import { Form } from "~/components/ui/form";
import { dealStatusIds, dealStatuses } from "~/domains/deal/enum";
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

const formSchema = z.object({
  title: z.string().min(1).max(DEAL_TITLE_MAX_LENGTH),
  content: z.string().max(DEAL_CONTENT_MAX_LENGTH),
  deadline: z.union([
    z.literal("").transform(() => undefined),
    z.coerce.date(),
  ]),
  status: z.enum(dealStatusIds),
  url: z.string().max(DEAL_URL_MAX_LENGTH),
});
type FormSchema = typeof formSchema;

type DealEditFormProps = {
  onSubmit: (data: z.output<FormSchema>) => Promise<void>;
};
export default function DealEditForm({ onSubmit }: DealEditFormProps) {
  const form = useForm<z.input<FormSchema>>({
    defaultValues: {
      title: "",
      content: "",
      deadline: "",
      url: "",
      status: dealStatusIds[0],
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
            form.handleSubmit as UseFormHandleSubmit<
              z.input<FormSchema>,
              z.output<FormSchema>
            >
          )(onSubmit)
        }
      >
        <ActionCard actionLabel="登録する" processingActonLabel="登録中です">
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
            selects={dealStatuses.map((status) => ({
              value: status.dealStatusId,
              label: status.label,
            }))}
            label="ステータス"
            name="status"
            className="max-w-28"
          />
        </ActionCard>
      </form>
    </Form>
  );
}
