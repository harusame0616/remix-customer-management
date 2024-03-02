import { useLocation, useSearchParams } from "@remix-run/react";
import { PER_PAGE } from "~/lib/pagination";

export function usePagination(totalCount: number) {
  const totalPage = Math.ceil(totalCount / PER_PAGE);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");
  const path = useLocation();

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPage ? currentPage + 1 : null;

  const prevSearchParams = prevPage ? new URLSearchParams(searchParams) : null;
  if (prevPage) {
    prevSearchParams?.set("page", prevPage.toString());
  }

  const nextSearchParams = nextPage ? new URLSearchParams(searchParams) : null;
  if (nextPage) {
    nextSearchParams?.set("page", nextPage.toString());
  }

  const nextUrl = nextSearchParams
    ? `${path.pathname}?${nextSearchParams.toString()}`
    : null;
  const prevUrl = prevSearchParams
    ? `${path.pathname}?${prevSearchParams.toString()}`
    : null;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPage) {
      throw new Error("Invalid page number");
    }

    setSearchParams((prev) => {
      prev.set("page", page.toString());
      return prev;
    });
  };

  return {
    currentPage,
    totalPage,
    totalCount,
    nextUrl,
    prevUrl,
    goToPage,
  };
}
