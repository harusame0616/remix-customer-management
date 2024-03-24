import { Prisma } from "@prisma/client";
import { DealPlatform, DealStatus } from "~/domains/deal/enum";

const dealSources: Prisma.DealCreateManyInput[] = [
  {
    // キーワード検索：タイトルでヒット
    dealId: "405c8968-010b-1d53-a51a-0583b990fe83",
    title: "キーワード検索テスト",
    url: "",
    content: "",
    attachments: [],
    platformId: DealPlatform.Coconala.dealPlatformId,
    statusId: DealStatus.InProgress.dealStatusId,
  },
  {
    // キーワード検索：取引内容でヒット
    dealId: "405c8968-010b-1d53-a51a-0583b990fe81",
    title: "test",
    url: "",
    content: "キーワード検索テスト",
    attachments: [],
    platformId: DealPlatform.Coconala.dealPlatformId,
    statusId: DealStatus.InProgress.dealStatusId,
  },
  {
    // 絞り込みテスト
    dealId: "415c8968-010b-1d53-a51a-0583b990fe81",
    title: "絞り込みテスト",
    url: "",
    content: "",
    attachments: [],
    platformId: DealPlatform.Coconala.dealPlatformId,
    statusId: DealStatus.InProgress.dealStatusId,
    deadline: new Date("2022-01-01T00:00:00+09:00"),
  },
  {
    // 絞り込みテスト
    dealId: "425c8968-010b-1d53-a51a-0583b990fe81",
    title: "絞り込みテスト",
    url: "",
    content: "",
    attachments: [],
    platformId: DealPlatform.Other.dealPlatformId,
    statusId: DealStatus.InProgress.dealStatusId,
    deadline: new Date("2022-01-01T00:00:00+09:00"),
  },
  {
    // 絞り込みテスト
    dealId: "435c8968-010b-1d53-a51a-0583b990fe81",
    title: "絞り込みテスト",
    url: "",
    content: "",
    attachments: [],
    platformId: DealPlatform.Other.dealPlatformId,
    statusId: DealStatus.Completed.dealStatusId,
    deadline: new Date("2022-01-01T00:00:00+09:00"),
  },
  {
    // 絞り込みテスト
    dealId: "435c8268-010b-1d53-a51a-0583b990fe81",
    title: "絞り込み-テスト",
    url: "",
    content: "",
    attachments: [],
    platformId: DealPlatform.Other.dealPlatformId,
    statusId: DealStatus.Completed.dealStatusId,
    deadline: new Date("2022-01-01T00:00:00+09:00"),
  },
  {
    // 絞り込みテスト
    dealId: "475c8968-010b-1d53-a51a-0583b990fe81",
    title: "絞り込みテスト",
    url: "",
    content: "",
    attachments: [],
    platformId: DealPlatform.Other.dealPlatformId,
    statusId: DealStatus.Completed.dealStatusId,
    deadline: new Date("2022-01-02T00:00:00+09:00"),
  },
  {
    // 絞り込みテスト
    dealId: "485c8968-010b-1d53-a51a-0583b990fe81",
    title: "絞り込みテスト",
    url: "",
    content: "",
    attachments: [],
    platformId: DealPlatform.Coconala.dealPlatformId,
    statusId: DealStatus.Completed.dealStatusId,
    deadline: new Date("2022-01-01T00:00:00+09:00"),
  },
  {
    // 絞り込みテスト
    dealId: "875c8968-010b-1d53-a51a-0583b990fe81",
    title: "絞り込みテスト",
    url: "",
    content: "",
    attachments: [],
    platformId: DealPlatform.Other.dealPlatformId,
    statusId: DealStatus.Completed.dealStatusId,
    deadline: new Date("2021-12-31T00:00:00+09:00"),
  },
];

export function createDealFixtures() {
  return [...dealSources];
}
