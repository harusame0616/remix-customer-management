import {
  CalendarIcon,
  Component1Icon,
  DesktopIcon,
  ExternalLinkIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { LoaderFunctionArgs, MetaFunction, defer } from "@remix-run/node";
import {
  Await,
  Link,
  useFormAction,
  useLoaderData,
  useParams,
  useSubmit,
} from "@remix-run/react";
import { format } from "date-fns";
import { Suspense, useId } from "react";
import { AlertDialog } from "~/components/alert-dialog";
import { PageLayout } from "~/components/page-layout";
import { SkeletonPlaceholder } from "~/components/skeleton-placeholder";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Role, roles } from "~/domains/auth-user/roles";
import { DealStatusId, dealStatusLabelMap } from "~/domains/deal/enum";
import { getRole, haveAuthorization } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => [{ title: "取引詳細" }];

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.dealId) {
    console.error("dealId is required");
    throw new Response("Bad Request", { status: 400 });
  }
  const role = await getRole(request);
  if (!haveAuthorization(roles, role)) {
    throw new Response("Forbidden", { status: 403 });
  }

  return defer({
    role,
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
  const deleteAction = useFormAction("delete");
  const submit = useSubmit();

  if (!param.dealId) {
    throw new Error("dealId is required");
  }

  return (
    <PageLayout
      title="取引詳細"
      toolbarItems={
        haveAuthorization([Role.Admin, Role.Editor], loadData.role)
          ? [
              <Link to={`/deals/${param.dealId}/edit`} key="edit">
                編集
              </Link>,
              <AlertDialog
                title="取引の削除確認"
                triggerLabel="削除"
                continueLabel="削除する"
                key="delete"
                action={(close) => {
                  submit(null, {
                    method: "POST",
                    action: deleteAction,
                  });
                  close();
                }}
              >
                取引を削除しますがよろしいですか？
              </AlertDialog>,
            ]
          : []
      }
    >
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
    </PageLayout>
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
