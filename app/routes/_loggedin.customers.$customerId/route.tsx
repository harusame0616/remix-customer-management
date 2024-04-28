import { Await, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { Suspense } from "react";
import { LinkTabs } from "~/components/link-tabs";
import { PageLayout } from "~/components/page-layout";
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

  const title = (
    <>
      <span className="mr-4">顧客詳細</span>
      <Suspense fallback={<Skeleton className="h-7 w-20" />}>
        <Await resolve={loadData.customer}>{({ name }) => name}</Await>
      </Suspense>
      <span className="ml-4">様</span>
    </>
  );

  return (
    <PageLayout title={title}>
      <LinkTabs links={links} />
      <div className="flex flex-col flex-grow overflow-auto">
        <Outlet />
      </div>
    </PageLayout>
  );
}
