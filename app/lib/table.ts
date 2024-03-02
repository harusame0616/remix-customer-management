export const SortOrder = {
  Asc: "asc",
  Desc: "desc",
};

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export function isSortOrder(value: unknown): value is SortOrder {
  return typeof value === "string" && Object.values(SortOrder).includes(value);
}

export function toSortOrder(value: unknown): SortOrder {
  return isSortOrder(value) ? value : SortOrder.Asc;
}
