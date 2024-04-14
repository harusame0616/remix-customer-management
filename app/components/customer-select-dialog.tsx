import { useFetcher } from "@remix-run/react";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Table } from "~/components/table";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog as ShadCNDialog,
} from "~/components/ui/dialog";
import { Skeleton } from "~/components/ui/skeleton";
import { CustomerDto } from "~/domains/customer/models/customer";
import { FormInput } from "./form-input";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { Loader } from "~/routes/_loggedin.api.customer-select/route";
import { PER_PAGE } from "~/lib/pagination";

const formSchema = z.object({
  keyword: z.string(),
});

export function CustomerSelectDialog({
  onSelect,
}: {
  onSelect: (customer: Pick<CustomerDto, "customerId" | "name">) => void;
}) {
  const formId = useId();
  const fetcher = useFetcher<Loader>();
  const form = useForm<z.infer<typeof formSchema>>();
  const [customers, setCustomers] = useState<
    Pick<CustomerDto, "name" | "customerId">[]
  >([]);
  const [open, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (fetcher.data?.success === true) {
      setCustomers(fetcher.data.customers);
    } else {
      setCustomers([]);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const searchParams = new URLSearchParams();
    if (keyword) {
      searchParams.set("keyword", keyword);
    }
    if (pageNumber) {
      searchParams.set("page", pageNumber.toString());
    }

    fetcher.load(
      `/api/customer-select${searchParams.size ? "?" + searchParams : ""}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pageNumber, keyword, fetcher.load]);

  return (
    <ShadCNDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          顧客を選択
        </Button>
      </DialogTrigger>
      <DialogContent className="h-5/6  w-full max-w-2xl overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>顧客選択</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <search>
            <form className="flex flex-col gap-2" id={formId}>
              <FormInput
                label="キーワード"
                control={form.control}
                description="名前、名前（かな）、住所、備考から検索"
                name="keyword"
              />
              <Button
                type="button"
                form={formId}
                onClick={async () => {
                  // onSubmit だとページ自体の submit が走ってしまうため
                  if (await form.trigger()) {
                    setKeyword(form.getValues("keyword"));
                  }
                }}
              >
                検索
              </Button>
            </form>
          </search>
        </Form>
        <div className="h-full w-full overflow-auto">
          {fetcher.state === "loading" ? (
            <CustomerSelectTable skeleton />
          ) : (
            <CustomerSelectTable
              customers={customers}
              onSelect={(customer) => {
                onSelect(customer);
                setOpen(false);
              }}
            />
          )}
        </div>
        <div className="flex">
          {pageNumber > 1 && (
            <Button
              variant="outline"
              type="button"
              onClick={() => setPageNumber((prev) => prev - 1)}
            >
              前へ
            </Button>
          )}
          <div className="flex items-center px-2">{pageNumber}ページ</div>
          {(fetcher.data?.success
            ? pageNumber < fetcher.data.totalCount / PER_PAGE
            : false) && (
            <Button
              variant="outline"
              type="button"
              onClick={() => setPageNumber((prev) => prev + 1)}
            >
              次へ
            </Button>
          )}
        </div>
      </DialogContent>
    </ShadCNDialog>
  );
}

const headers = [
  { sortKey: "name", label: "名前" },
  { sortKey: "select", label: "選択" },
];
type CustomerSelectTableProps = {
  skeleton?: false;
  customers: Pick<CustomerDto, "customerId" | "name">[];
  onSelect: (customer: Pick<CustomerDto, "customerId" | "name">) => void;
};
type CustomerTableSkeletonProps = {
  skeleton: true;
};
export function CustomerSelectTable(
  props: CustomerSelectTableProps | CustomerTableSkeletonProps,
) {
  const customers = props.skeleton
    ? Array.from({ length: 10 }).map(() => {
        return {
          name: <Skeleton className="h-4 w-20" />,
          select: <Skeleton className="h-8 w-8" />,
        };
      })
    : props.customers.map((customer) => ({
        name: customer.name,
        select: (
          <Button type="button" onClick={() => props.onSelect(customer)}>
            選択
          </Button>
        ),
      }));

  return <Table rows={customers} headers={headers} />;
}
