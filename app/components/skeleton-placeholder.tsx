import { cn } from "~/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { PropsWithChildren } from "react";

type SkeletonOrProps = PropsWithChildren<{
  isSkeleton: boolean;
  className?: string;
}>;
export function SkeletonPlaceholder({
  isSkeleton = false,
  className,
  children,
}: SkeletonOrProps) {
  return isSkeleton ? <Skeleton className={cn(className)} /> : children ?? null;
}
