import {
  AlertDialog as ShadCNAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  title: React.ReactNode;
  triggerLabel: string;
  continueLabel: string;
  action: (close: () => void) => void;
};
export function AlertDialog({
  children,
  title,
  triggerLabel,
  continueLabel,
  action,
}: Props) {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
  };

  return (
    <ShadCNAlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{triggerLabel}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => action(close)}
          >
            {continueLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </ShadCNAlertDialog>
  );
}
