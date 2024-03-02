import { PropsWithChildren } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { useIsSubmitting } from "~/hooks/use-is-loading";
import { ReloadIcon } from "@radix-ui/react-icons";

type ActionCardProps = PropsWithChildren<{
  actionLabel: string;
  processingActonLabel: string;
}>;
export function ActionCard({
  actionLabel,
  children,
  processingActonLabel,
}: ActionCardProps) {
  const isSubmitting = useIsSubmitting();

  return (
    <Card className="p-8 space-y-8">
      <div className="space-y-8">{children}</div>
      <Separator />
      <Button
        className="w-full aria-disabled:opacity-50 aria-disabled:pointer-event-none aria-disabled:cursor-default"
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="mr-2">{processingActonLabel}</span>
            <ReloadIcon
              className="animate-spin motion-reduce:hidden"
              aria-hidden
            />
          </>
        ) : (
          actionLabel
        )}
      </Button>
    </Card>
  );
}
