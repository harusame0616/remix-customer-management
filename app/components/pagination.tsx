import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadCNPagination,
} from "~/components/ui/pagination";
import { usePagination } from "~/hooks/use-pagination";
import { toPage } from "~/lib/pagination";
import { cn } from "~/lib/utils";
import { Skeleton } from "./ui/skeleton";

type PaginationProps =
  | { totalCount: number; className?: string; skeleton?: never }
  | { skeleton: true; totalCount?: never; className?: string };
export function Pagination({
  totalCount,
  className,
  skeleton,
}: PaginationProps) {
  const { currentPage, nextUrl, goToPage, prevUrl, totalPage } = usePagination(
    totalCount ?? 0,
  );

  return (
    <div className={cn("flex flex-col md:flex-row md:justify-end", className)}>
      <div>
        <ShadCNPagination className="py-1">
          <PaginationContent className="flex">
            {prevUrl && (
              <PaginationItem>
                <PaginationPrevious to={prevUrl} />
              </PaginationItem>
            )}
            {nextUrl && (
              <PaginationItem>
                <PaginationNext to={nextUrl} />
              </PaginationItem>
            )}
          </PaginationContent>
        </ShadCNPagination>
      </div>
      <div className="flex gap-4 pb-1 justify-center -mt-1 md:mt-0 md:pt-1">
        <div className="flex items-center text-sm text-muted-foreground">
          （全 {skeleton ? <Skeleton className="w-4 h-4 px-1" /> : totalPage}
          ページ）
        </div>
        <form
          className="flex items-center gap-2"
          method="GET"
          onSubmit={(e) => {
            e.preventDefault();
            const page = new FormData(e.target as HTMLFormElement).get("page");
            goToPage(toPage(page));
          }}
        >
          {skeleton ? (
            <>
              <Skeleton className="w-14 h-11" />
              <Skeleton className="w-28 h-11" />
            </>
          ) : (
            <>
              <Input
                aria-label="移動先のページ番号"
                defaultValue={currentPage}
                type="number"
                name="page"
                min={1}
                required
                max={totalPage}
                className="max-w-16 h-11"
              />
              <Button variant="outline">ページへ移動</Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
