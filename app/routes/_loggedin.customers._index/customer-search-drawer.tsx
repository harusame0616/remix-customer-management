import { useSearchParams } from "@remix-run/react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "~/components/form-input";
import { SearchDrawer } from "~/components/search-drawer";
import { parseGetCustomersSearchParams } from "./search";
import { zodResolver } from "@hookform/resolvers/zod";

const searchFormSchema = z.object({
  keyword: z
    .string()
    .max(255)
    .transform((v) => v.trim() || undefined),
});
export function CustomerSearchDrawer() {
  const [searchParam] = useSearchParams();
  const queries = parseGetCustomersSearchParams(searchParam);

  const defaultValues: DefaultValues<z.input<typeof searchFormSchema>> = {
    keyword: queries.success ? queries.data.keyword || "" : "",
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
            description="名前、名前（かな）、住所、備考から検索"
            name="keyword"
          />
        </div>
      </SearchDrawer>
    </FormProvider>
  );
}
