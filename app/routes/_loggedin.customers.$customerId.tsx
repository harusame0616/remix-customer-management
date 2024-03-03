import { Separator } from "@radix-ui/react-separator";
import { defer } from "@remix-run/node";
import { Await, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { Suspense } from "react";
import { LinkTabs } from "~/components/link-tabs";
import { Skeleton } from "~/components/ui/skeleton";

export async function loader() {
  return defer({
    success: true,
    fullName: new Promise<string>((resolve) =>
      setTimeout(() => resolve("山田 太郎"), 1000)
    ),
  });
}
export default function Page() {
  const loadData = useLoaderData<typeof loader>();
  const param = useParams();

  if (!param.customerId) {
    return <div>error</div>;
  }

  const customerId = param.customerId;
  const links = [
    { to: `/customers/${customerId}`, label: "プロフィール", end: true },
    { to: `/customers/${customerId}/negotiations`, label: "商談", end: true },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 md:px-4 flex">
        <h1 className="flex gap-2 text-sm text-muted-foreground line items-end">
          <span>顧客詳細</span>
          <span className="text-xl font-bold text-foreground -mb-px">
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <Await resolve={loadData.fullName}>
                {(fullName) => fullName}
              </Await>
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
