import { format } from "date-fns";

export function formatToDateTime(date: Date | string) {
  return format(date, "yyyy-MM-dd HH:mm");
}

export function formatToDate(date: Date | string) {
  return format(date, "yyyy-MM-dd");
}
