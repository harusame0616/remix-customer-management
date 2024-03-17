import { useNavigation, useSearchParams } from "@remix-run/react";
import { SortOrder, toSortOrder } from "~/lib/table";

const SORT_KEY_NAME = "sortKey";
const SORT_ORDER_NAME = "sortOrder";

type UseSortOption = {
  defaultSortKey?: string;
};
type UseSortReturn = {
  sortKey?: string;
  sortOrder: SortOrder;
  changeSort: (sortKey: string) => void;
};

export function useSort(
  option: Required<UseSortOption>,
): Required<UseSortReturn>;
export function useSort(option?: UseSortOption): UseSortReturn;
export function useSort(option: UseSortOption = {}): UseSortReturn {
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();

  const sortKey =
    new URLSearchParams(navigation.location?.search).get(SORT_KEY_NAME) ||
    searchParams.get(SORT_KEY_NAME) ||
    undefined;
  const sortOrder = toSortOrder(
    new URLSearchParams(navigation.location?.search).get(SORT_ORDER_NAME) ||
      searchParams.get(SORT_ORDER_NAME),
  );

  const changeSort = (sortKey: string) => {
    setSearchParams((prev) => {
      const currentSortKey = prev.get(SORT_KEY_NAME) || option.defaultSortKey;
      const currentSortOrder = prev.get(SORT_ORDER_NAME);
      prev.set(SORT_KEY_NAME, sortKey);
      prev.set(
        SORT_ORDER_NAME,
        currentSortKey !== sortKey || currentSortOrder === SortOrder.Desc
          ? SortOrder.Asc
          : SortOrder.Desc,
      );

      return prev;
    });
  };

  if (option.defaultSortKey) {
    return {
      sortKey: sortKey || option.defaultSortKey,
      sortOrder,
      changeSort,
    };
  }

  return { sortKey, sortOrder, changeSort };
}
