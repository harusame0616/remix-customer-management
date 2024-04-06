import { Await, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { CustomerDto } from "~/domains/customer/models/customer";
import { formatToDate, formatToDateTime } from "~/lib/date";
import { sexToLabel } from "~/lib/sex";
import {
  toHyphenMobilePhoneNumber,
  toHyphenPhoneNumber,
  toHyphenPostNumber,
} from "../../domains/customer/libs/converter";
import { Loader } from "./controllers";

export { loader, type Loader } from "./controllers";

export default function Page() {
  const loadData = useLoaderData<Loader>();

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

type ProfileProps =
  | {
      skeleton: true;
    }
  | {
      customer: CustomerDto;
      skeleton?: false;
    };
function Profile(props: ProfileProps) {
  const items: {
    label: string;
    value: React.ReactNode;
    href?: string;
  }[] = props.skeleton
    ? [
        { label: "名前", value: <Skeleton className="h-6 w-20" /> },
        { label: "名前（かな）", value: <Skeleton className="h-6 w-20" /> },
        { label: "性別", value: <Skeleton className="h-6 w-20" /> },
        { label: "誕生日", value: <Skeleton className="h-6 w-20" /> },
        { label: "メール", value: <Skeleton className="h-6 w-20" /> },
        { label: "電話番号", value: <Skeleton className="h-6 w-20" /> },
        { label: "携帯電話番号", value: <Skeleton className="h-6 w-20" /> },
        { label: "URL", value: <Skeleton className="h-6 w-20" /> },
        { label: "郵便番号", value: <Skeleton className="h-6 w-20" /> },
        { label: "住所", value: <Skeleton className="h-6 w-20" /> },
        { label: "ノート", value: <Skeleton className="h-6 w-20" /> },
        { label: "登録日時", value: <Skeleton className="h-6 w-20" /> },
      ]
    : [
        { label: "名前", value: props.customer.name },
        { label: "名前（かな）", value: props.customer.nameKana },
        { label: "性別", value: sexToLabel(props.customer.sex) },
        {
          label: "誕生日",
          value: props.customer.birthday
            ? formatToDate(props.customer.birthday)
            : undefined,
        },
        {
          label: "メール",
          value: props.customer.email,
          href: !props.customer.email
            ? undefined
            : `mailto:${props.customer.email}`,
        },
        {
          label: "電話番号",
          value: props.customer.phone
            ? toHyphenPhoneNumber(props.customer.phone)
            : undefined,
          href: !props.customer.phone
            ? undefined
            : `tel:${props.customer.phone}`,
        },
        {
          label: "携帯電話番号",
          value: props.customer.mobilePhone
            ? toHyphenMobilePhoneNumber(props.customer.mobilePhone)
            : undefined,
          href: !props.customer.mobilePhone
            ? undefined
            : `tel:${props.customer.mobilePhone}`,
        },
        {
          label: "URL",
          value: props.customer.url,
          href: !props.customer.url ? undefined : props.customer.url,
        },
        {
          label: "郵便番号",
          value: props.customer.postCode
            ? toHyphenPostNumber(props.customer.postCode)
            : undefined,
        },
        { label: "住所", value: props.customer.address },
        { label: "ノート", value: props.customer.note },
        {
          label: "登録日時",
          value: formatToDateTime(props.customer.registeredAt),
        },
      ];

  return (
    <dl className="space-y-2">
      {items.map((item, i) => (
        <div
          className="grid grid-cols-5 min-h-8"
          key={item.label + item.value}
          data-testid={`profile${i}`}
        >
          <dt className="text-muted-foreground text-sm flex items-center pt-1">
            {item.label}
          </dt>
          <dd className="col-span-4 flex items-center break-all whitespace-pre-wrap">
            {item.href ? (
              <Link to={item.href}>{item.value}</Link>
            ) : (
              item.value || (
                <span className="text-xs text-muted-foreground">
                  （入力なし）
                </span>
              )
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
