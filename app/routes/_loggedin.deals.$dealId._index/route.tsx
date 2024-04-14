import {
  CalendarIcon,
  Component1Icon,
  DesktopIcon,
  ExternalLinkIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { LoaderFunctionArgs, MetaFunction, defer } from "@remix-run/node";
import { Await, Link, useLoaderData, useParams } from "@remix-run/react";
import { format } from "date-fns";
import { Suspense, useId } from "react";
import { SkeletonPlaceholder } from "~/components/skeleton-placeholder";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { DealStatusId, dealStatusLabelMap } from "~/domains/deal/enum";
import prisma from "~/lib/prisma";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => [{ title: "取引詳細" }];

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.dealId) {
    console.error("dealId is required");
    throw new Response("Bad Request", { status: 400 });
  }

  return defer({
    dealDetail: new Promise<DealDetail>((resolve, reject) =>
      prisma.deal
        .findUnique({
          where: { dealId: params.dealId },
          select: {
            title: true,
            content: true,
            url: true,
            deadline: true,
            statusId: true,
            platform: { select: { label: true } },
            customer: {
              select: {
                name: true,
                customerId: true,
              },
            },
          },
        })
        .then((data) => {
          if (!data) {
            return reject(new Error("error"));
          }

          resolve({
            title: data.title,
            content: data.content,
            url: data.url,
            deadline: data.deadline ?? undefined,
            statusId: data.statusId as DealStatusId,
            platform: {
              name: data.platform.label,
            },
            customer: data.customer
              ? {
                  name: data.customer.name,
                  customerId: data.customer.customerId,
                }
              : undefined,
          });
        }),
    ),
  });
}
export default function Page() {
  const loadData = useLoaderData<typeof loader>();
  const param = useParams();

  if (!param.dealId) {
    throw new Error("dealId is required");
  }

  return (
    <div className="flex flex-col h-full">
      <section aria-label="タイトルバー" className="p-2 md:px-4 flex text-lg">
        <h1 className="flex-grow flex items-center">
          取引詳細：
          {
            <Suspense fallback={<Skeleton className="h-4 w-20" />}>
              <Await resolve={loadData.dealDetail}>
                {(dealDetail) => dealDetail.title}
              </Await>
            </Suspense>
          }
        </h1>
        <div className="flex gap-x-4 items-center">
          <div>
            <Link to={`/deals/${param.dealId}/edit`}>編集</Link>
          </div>
          <Button variant="destructive">削除</Button>
        </div>
      </section>
      <Separator />
      <div className="flex flex-col flex-grow overflow-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl p-4">
            <Suspense fallback={<DealDetail skeleton />}>
              <Await resolve={loadData.dealDetail}>
                {(dealDetail) => (
                  <DealDetail
                    dealDetail={{
                      ...dealDetail,
                      deadline: dealDetail.deadline
                        ? new Date(dealDetail.deadline)
                        : undefined,
                    }}
                  />
                )}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

type DealDetail = {
  title: string;
  content: string;
  url: string;
  deadline?: Date;
  statusId: DealStatusId;
  platform: {
    name: string;
  };
  customer?: {
    name: string;
    customerId: string;
  };
} & DealMeta;
type DealDetailProps =
  | {
      dealDetail?: undefined;
      skeleton: true;
    }
  | {
      dealDetail: DealDetail;
      skeleton?: false;
    };
function DealDetail({ dealDetail, skeleton }: DealDetailProps) {
  const dealContentLabelId = useId();
  const meta = {
    platformName: dealDetail?.platform?.name,
    statusId: dealDetail?.statusId,
    deadline: dealDetail?.deadline,
    url: dealDetail?.url,
    customer: dealDetail?.customer,
  };

  return (
    <div className="px-4 py-2 space-y-4">
      <h2 className="text-3xl font-bold">
        <SkeletonPlaceholder isSkeleton={!!skeleton} className="h-9 w-72">
          {dealDetail?.title}
        </SkeletonPlaceholder>
      </h2>
      <Separator />
      <DealMeta meta={meta} skeleton={!!skeleton} />
      <Separator />
      <section className="space-y-1" aria-labelledby={dealContentLabelId}>
        <h3 id={dealContentLabelId} className="font-bold text-xl mb-2">
          取引内容
        </h3>
        <SkeletonPlaceholder isSkeleton={!!skeleton} className="h-5 w-20">
          <p className="min-h-24 w-full whitespace-pre-wrap break-all">
            {dealDetail?.content || "-"}
          </p>
        </SkeletonPlaceholder>
        {!!skeleton &&
          [
            "w-60",
            "w-40",
            "w-px",
            "w-40",
            "w-30",
            "w-30",
            "w-px",
            "w-40",
            "w-20",
          ].map((w, i) => <Skeleton key={i} className={cn("h-5", w)} />)}
      </section>
    </div>
  );
}

type DealMeta = {
  platformName?: string;
  statusId?: DealStatusId;
  deadline?: Date;
  url?: string;
  customer?: {
    name: string;
    customerId: string;
  };
};
type DealMetaProps = {
  meta: DealMeta;
  skeleton: boolean;
};
function DealMeta({
  meta: { platformName, statusId, deadline, url, customer },
  skeleton,
}: DealMetaProps) {
  const elements = [
    {
      icon: <PersonIcon />,
      label: "顧客",
      value: customer && (
        <Link to={`/customers/${customer.customerId}`}>{customer.name}</Link>
      ),
      skeletonClass: "w-40 h-6",
    },
    {
      icon: <CalendarIcon />,
      label: "締め切り",
      value: deadline && format(deadline, "yyyy/MM/dd"),
      skeletonClass: "w-20 h-6",
    },
    {
      icon: <DesktopIcon />,
      label: "プラットフォーム",
      value: platformName,
      skeletonClass: "w-40 h-6",
    },
    {
      icon: <ExternalLinkIcon />,
      label: "URL",
      value: url && <Link to={url}>{url}</Link>,
      skeletonClass: "w-40 h-6",
    },
    {
      icon: <Component1Icon />,
      label: "ステータス",
      value: statusId && dealStatusLabelMap[statusId],
      skeletonClass: "w-12 h-6",
    },
  ];
  return (
    <section aria-label="取引情報">
      <dl className="space-y-1">
        {elements.map((element, i) => (
          <div key={i} className="grid grid-cols-5">
            <dt className="text-muted-foreground text-sm flex gap-2 items-center">
              <span aria-hidden>{element.icon}</span>
              {element.label}
            </dt>
            <dd className="col-span-3">
              <SkeletonPlaceholder
                isSkeleton={!!skeleton}
                className={element.skeletonClass}
              >
                {element.value || "-"}
              </SkeletonPlaceholder>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
