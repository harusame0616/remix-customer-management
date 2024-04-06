import { Separator } from "@radix-ui/react-separator";
import { Await, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { Suspense } from "react";
import { LinkTabs } from "~/components/link-tabs";
import { Skeleton } from "~/components/ui/skeleton";
import { type Loader } from "./controllers";
export { loader } from "./controllers";

export default function Page() {
  const loadData = useLoaderData<Loader>();
  const param = useParams();

  const customerId = param.customerId;
  const links = [
    {
      to: `/customers/${customerId}`,
      label: "プロフィール",
      end: true,
    },
    { to: `/customers/${customerId}/negotiations`, label: "商談", end: true },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 md:px-4 flex">
        <h1 className="flex gap-2 text-sm text-muted-foreground line items-end">
          <span>顧客詳細</span>
          <span className="text-xl font-bold text-foreground -mb-px">
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <Await resolve={loadData.customer}>{({ name }) => name}</Await>
            </Suspense>
          </span>
          <span>様</span>
        </h1>
      </div>
      <Separator />
      <LinkTabs links={links} />
      <div className="flex flex-col flex-grow overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
