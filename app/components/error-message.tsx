import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

type ErrorMessageProps = {
  message?: string;
};
export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    message && (
      <Alert variant="destructive" className="mb-4 empty:hidden">
        <ExclamationTriangleIcon className="w-4 h-4" />
        <AlertTitle>エラー</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )
  );
}
