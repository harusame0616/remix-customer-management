import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { FormCheckbox, FormInput } from "~/components/form-input";
import { SearchDrawer } from "~/components/search-drawer";
import {
  DealPlatform,
  DealStatus,
  dealPlatformIds,
  dealStatusIds,
} from "~/domains/deal/enum";
import { parseGetDealsSearchParams } from "../../../routes/_loggedin.deals._index/route";

const searchFormSchema = z.object({
  keyword: z
    .string()
    .max(255)
    .transform((v) => v.trim() || undefined),
  deadlineFrom: z.union([
    z.literal("").transform(() => undefined),
    z.string().transform((v) => v + "T00:00:00+09:00"),
  ]),
  deadlineTo: z.union([
    z.literal("").transform(() => undefined),
    z.string().transform((v) => v + "T23:59:59+09:00"),
  ]),
  statusId: z.array(z.enum(dealStatusIds)),
  platformId: z.array(z.enum(dealPlatformIds)),
});
export function DealSearchDrawer() {
  const [searchParam] = useSearchParams();
  const queries = parseGetDealsSearchParams(searchParam);

  const defaultValues: DefaultValues<z.input<typeof searchFormSchema>> = {
    keyword: queries.success ? queries.data.keyword || "" : "",
    statusId: queries.success ? queries.data.statusId : dealStatusIds,
    platformId: queries.success ? queries.data.platformId : dealPlatformIds,
    deadlineFrom:
      queries.success && queries.data.deadlineFrom
        ? format(queries.data.deadlineFrom, "yyyy-MM-dd")
        : "",
    deadlineTo:
      queries.success && queries.data.deadlineTo
        ? format(queries.data.deadlineTo, "yyyy-MM-dd") || ""
        : "",
  };

  const form = useForm<
    z.input<typeof searchFormSchema>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    z.output<typeof searchFormSchema>
  >({
    defaultValues,
    resolver: zodResolver(searchFormSchema),
  });

  return (
    <FormProvider {...form}>
      <SearchDrawer className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
        <div className="md:col-span-3">
          <FormInput
            control={form.control}
            label="キーワード"
            description="タイトル、取引内容から検索"
            name="keyword"
          />
        </div>
        <FormCheckbox
          column={3}
          control={form.control}
          name="statusId"
          label="ステータス"
          selects={Object.values(DealStatus).map((status) => ({
            label: status.label,
            value: status.dealStatusId,
          }))}
        />
        <FormCheckbox
          column={3}
          control={form.control}
          name="platformId"
          label="プラットフォーム"
          selects={Object.values(DealPlatform).map((platform) => ({
            label: platform.label,
            value: platform.dealPlatformId,
          }))}
        />
        <fieldset>
          <legend className="text-sm">締め切り</legend>
          <div className="flex gap-2">
            <FormInput
              control={form.control}
              label="from"
              type="date"
              name="deadlineFrom"
            />
            <FormInput
              control={form.control}
              label="to"
              type="date"
              name="deadlineTo"
            />
          </div>
        </fieldset>
      </SearchDrawer>
    </FormProvider>
  );
}
