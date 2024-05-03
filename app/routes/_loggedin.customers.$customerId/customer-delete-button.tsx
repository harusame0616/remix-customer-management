import { useFormAction, useSubmit } from "@remix-run/react";
import { AlertDialog } from "~/components/alert-dialog";

export function CustomerDeleteButton() {
  const deleteAction = useFormAction("delete");
  const submit = useSubmit();

  return (
    <AlertDialog
      title="顧客の削除確認"
      triggerLabel="削除"
      continueLabel="削除する"
      key="delete"
      action={() => {
        submit(null, {
          method: "POST",
          action: deleteAction,
        });
      }}
    >
      顧客を削除しますがよろしいですか？
      <br />
      顧客を削除すると、紐づけてある商談の紐づけは解除されます
    </AlertDialog>
  );
}
