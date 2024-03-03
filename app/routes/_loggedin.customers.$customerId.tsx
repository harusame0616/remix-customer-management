import { Separator } from "@radix-ui/react-separator";
import { defer } from "@remix-run/node";
import {
  Await,
  Link,
  Outlet,
  useLoaderData,
  useMatches,
  useParams,
} from "@remix-run/react";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

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

  const [, , , customerView] = useMatches();
  const viewTabId = customerView
    ? customerView.pathname.split("/")[3]
    : "profiles";

  if (!param.customerId) {
    return <div>error</div>;
  }

  const customerId = param.customerId;

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
      <Tabs defaultValue={viewTabId}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profiles" asChild>
            <Link className="no-underline" to={`/customers/${customerId}`}>
              プロフィール
            </Link>
          </TabsTrigger>
          <TabsTrigger className="no-underline" value="negotiations" asChild>
            <Link to={`/customers/${customerId}/negotiations`}>商談</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex flex-col flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
