export const DealStatus = {
  UnderConsideration: {
    dealStatusId: "under_consideration",
    label: "検討中",
  },
  UnderProposal: {
    dealStatusId: "under_proposal",
    label: "提案中",
  },
  InProgress: {
    dealStatusId: "in_progress",
    label: "進行中",
  },
  Completed: {
    dealStatusId: "completed",
    label: "完了",
  },
  Canceled: {
    dealStatusId: "canceled",
    label: "キャンセル",
  },
  Rejected: {
    dealStatusId: "rejected",
    label: "棄却",
  },
} as const;

export type DealStatusId =
  (typeof DealStatus)[keyof typeof DealStatus]["dealStatusId"];
export const dealStatuses = Object.values(DealStatus);
export const dealStatusIds = dealStatuses.map(
  ({ dealStatusId }) => dealStatusId,
) as [DealStatusId, ...DealStatusId[]];

type DealStatusLabelMap = Record<DealStatusId, string>;
export const dealStatusLabelMap = Object.fromEntries(
  dealStatuses.map(({ dealStatusId, label }) => [dealStatusId, label]),
) as DealStatusLabelMap;

export const DealPlatform = {
  Other: {
    dealPlatformId: "other",
    label: "その他",
  },
  Coconala: {
    dealPlatformId: "coconala",
    label: "coconala",
  },
  Lancers: {
    dealPlatformId: "lancers",
    label: "Lancers",
  },
  CloudWorks: {
    dealPlatformId: "cloud_works",
    label: "CloudWorks",
  },
} as const;
export type DealPlatformId =
  (typeof DealPlatform)[keyof typeof DealPlatform]["dealPlatformId"];
export const dealPlatforms = Object.values(DealPlatform);
export const dealPlatformIds = dealPlatforms.map(
  ({ dealPlatformId }) => dealPlatformId,
) as [DealPlatformId, ...DealPlatformId[]];
