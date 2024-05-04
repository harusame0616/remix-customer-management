import { SortOrder } from "~/lib/table";
import { users } from "../../domains/auth-user/users";
import { PER_PAGE } from "~/lib/pagination";

export const sortKeys = ["name", "email", "role"] as const;
export type SortKey = (typeof sortKeys)[number];

type GetUsersParams = {
  page: number;
  sortKey: SortKey;
  sortOrder: SortOrder;
};
export async function getUsers({ page, sortKey, sortOrder }: GetUsersParams) {
  return users
    .sort((a, b) => {
      const sign = sortOrder === "asc" ? 1 : -1;

      return a[sortKey].localeCompare(b[sortKey]) * sign;
    })
    .slice((page - 1) * PER_PAGE, page * PER_PAGE);
}

export async function getTotal() {
  return users.length;
}
