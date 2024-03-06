import { defer, type MetaFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import prisma from "~/lib/prisma";

export async function loader() {
  return defer({
    message: "Hello World",
    customerCount: prisma.customer.count().then((v) => v),
  });
}

export const meta: MetaFunction = () => {
  return [{ title: "トップ - 顧客管理システム" }];
};

export default function Index() {
  const loadData = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>index</h1>
      <Suspense fallback="loading...">
        <Await resolve={loadData.customerCount}>
          {(customerCount) => (
            <span>customer count：{JSON.stringify(customerCount)}</span>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
