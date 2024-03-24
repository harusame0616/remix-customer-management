import { Await } from "@remix-run/react";
import { ComponentProps, Suspense } from "react";
import { PageLayout } from "./page-layout";
import { Pagination } from "./pagination";

type Props = Omit<ComponentProps<typeof PageLayout>, "footer"> & {
  totalCount: Promise<number>;
};
export function ListPageLayout({ totalCount, ...props }: Props) {
  return (
    <PageLayout
      {...props}
      footer={
        <div className="py-1 px-2">
          <Suspense fallback={<Pagination skeleton />}>
            <Await resolve={totalCount}>
              {(totalCount) => <Pagination totalCount={totalCount} />}
            </Await>
          </Suspense>
        </div>
      }
    />
  );
}
