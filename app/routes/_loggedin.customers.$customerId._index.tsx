import { defer } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { customersFixture } from "~/fixtures/customers";
import {
  toHyphenPhoneNumber,
  toHyphenMobilePhoneNumber,
  toHyphenPostNumber,
} from "../domains/customer/libs/converter";

export async function loader() {
  const customer = customersFixture[0];

  return defer({
    customer: new Promise<typeof customer>((resolve) =>
      setTimeout(() => resolve(customer), 1000),
    ),
  });
}

export default function Page() {
  const loadData = useLoaderData<typeof loader>();

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl p-4">
        <Suspense fallback={<Profile skeleton />}>
          <Await resolve={loadData.customer}>
            {(customer) => <Profile customer={customer} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

function skeletonOrValue(
  skeleton: boolean | undefined,
  value: React.ReactNode,
) {
  return skeleton ? <Skeleton className="h-4 w-20" /> : value;
}

type ProfileProps =
  | {
      customer?: undefined;
      skeleton: true;
    }
  | {
      customer: (typeof customersFixture)[0];
      skeleton?: false;
    };
function Profile({ customer, skeleton }: ProfileProps) {
  const items: {
    label: string;
    value: React.ReactNode;
    href?: string;
  }[] = [
    {
      label: "顧客コード",
      value: skeletonOrValue(skeleton, "customerCode"),
    },
    {
      label: "名前",
      value: skeletonOrValue(skeleton, customer?.fullName),
    },
    {
      label: "性別",
      value: skeletonOrValue(skeleton, customer?.sex),
    },
    {
      label: "生年月日",
      value: skeletonOrValue(skeleton, customer?.birthday),
    },
    {
      label: "電話番号",
      value: skeletonOrValue(
        skeleton,
        customer?.phoneNumber
          ? toHyphenPhoneNumber(customer.phoneNumber)
          : undefined,
      ),
      href: customer?.phoneNumber ? `tel:${customer.phoneNumber}` : undefined,
    },
    {
      label: "携帯電話",
      value: skeletonOrValue(
        skeleton,
        customer?.mobilePhoneNumber
          ? toHyphenMobilePhoneNumber(customer.mobilePhoneNumber)
          : undefined,
      ),
      href: customer?.mobilePhoneNumber
        ? `tel:${customer.mobilePhoneNumber}`
        : undefined,
    },
    {
      label: "メール",
      value: skeletonOrValue(skeleton, customer?.email),
      href: customer?.email ? `mailto:${customer.email}` : undefined,
    },
    {
      label: "郵便番号",
      value: skeletonOrValue(
        skeleton,
        customer?.postNumber
          ? toHyphenPostNumber(customer.postNumber)
          : undefined,
      ),
    },
    {
      label: "住所",
      value: skeletonOrValue(skeleton, customer?.address),
    },
    {
      label: "登録年月日",
      value: skeletonOrValue(skeleton, "1999-01-01"),
    },
    {
      label: "ノート",
      value: skeletonOrValue(skeleton, customer?.note),
    },
  ];

  return (
    <dl className="space-y-2">
      {items.map((item) => (
        <div className="grid grid-cols-5 h-8" key={item.label + item.value}>
          <dt className="text-muted-foreground text-sm flex items-start pt-1">
            {item.label}
          </dt>
          <dd className="col-span-4 flex items-start break-all whitespace-pre-wrap">
            {item.href ? <Link to={item.href}>{item.value}</Link> : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
