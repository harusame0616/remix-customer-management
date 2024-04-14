import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { ReactNode, useId } from "react";
import { useSort } from "~/hooks/use-sort";
import { SortOrder } from "~/lib/table";
import { Button } from "./ui/button";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type Header = { sortKey: string; label: string; noSort?: boolean };
type TableProps = {
  headers: Header[];
  skeleton?: false;
  rows: Record<string, ReactNode>[];
  currentSortKey?: string;
  sortOrder?: SortOrder;
};
export function Table(props: TableProps) {
  return (
    <ShadcnTable className="overflow-auto">
      <TableHeader className="sticky top-0 bg-background drop-shadow-sm ">
        <TableRow>
          {props.headers.map(({ sortKey, label, noSort }) => (
            <HeaderItem
              key={sortKey}
              sortKey={sortKey}
              currentSortKey={props.currentSortKey}
              label={label}
              noSort={noSort}
            />
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.rows.map((row, index) => (
          <TableRow key={index}>
            {props.headers.map(({ sortKey }) => (
              <TableCell key={sortKey}>{row[sortKey]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </ShadcnTable>
  );
}

type HeaderItemProps = {
  sortKey: string;
  label: string;
  noSort?: boolean;
  currentSortKey?: string;
};
function HeaderItem({
  currentSortKey,
  sortKey,
  label,
  noSort,
}: HeaderItemProps) {
  const { changeSort, sortOrder } = useSort({ defaultSortKey: currentSortKey });
  const ariaSortMap = {
    [SortOrder.Asc]: "ascending",
    [SortOrder.Desc]: "descending",
  } as const;

  const ariaSort = currentSortKey === sortKey ? ariaSortMap[sortOrder] : "none";

  return (
    <TableHead aria-sort={ariaSort}>
      {noSort ? (
        <span>{label}</span>
      ) : (
        <Button
          onClick={() => changeSort(sortKey)}
          variant="ghost"
          className="w-full text-left p-0 flex justify-start font-bold"
        >
          <span className="mr-2">{label}</span>
          {currentSortKey === sortKey && <SortIcon sort={sortOrder} />}
        </Button>
      )}
    </TableHead>
  );
}

function SortIcon({ sort }: { sort: SortOrder }) {
  const [Icon, label] =
    sort === SortOrder.Asc
      ? [ChevronDownIcon, "昇順"]
      : [ChevronUpIcon, "降順"];
  const id = useId();

  return (
    <div>
      <Icon aria-labelledby={id} role="img" />
      <span className="sr-only" aria-hidden id={id}>
        {label}
      </span>
    </div>
  );
}
