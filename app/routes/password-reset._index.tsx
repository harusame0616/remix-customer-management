import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, json, useActionData, useSubmit } from "@remix-run/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { ErrorMessage } from "~/components/error-message";
import { InputWithLabel } from "~/components/input-with-label";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { useIsLoading } from "~/hooks/use-is-loading";
import { resetPassword } from "~/lib/auth";

export const meta: MetaFunction = () => {
  return [
    {
      title: "ログイン - 顧客管理システム",
      description: "ログインページです",
    },
  ];
};

const resetParamSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください。")
    .email("メールアドレスの形式で入力してください。"),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const resetParam = resetParamSchema.safeParse(await request.json());
  if (!resetParam.success) {
    return json(
      {
        success: false,
        message: resetParam.error.issues
          .map(({ message }) => message)
          .join("\n"),
      },
      { status: 400 }
    );
  }

  const { success } = await resetPassword(resetParam.data);
  return success
    ? redirect("/password-reset/mail-send")
    : json(
        {
          success: false,
          message: "リセットに失敗しました。時間をおいてお試しください。",
        },
        { status: 401 }
      );
};

export default function Index() {
  const isLoading = useIsLoading();
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex items-center flex-col mx-8">
      <section
        className="mt-[10%] max-w-md w-full"
        aria-labelledby="login-section-text"
      >
        <h1
          className="text-xl text-center mb-4 font-bold"
          id="login-section-text"
        >
          顧客管理システム
        </h1>
        <h2 className="text-center mb-1">パスワードリセット</h2>
        <ErrorMessage message={isLoading ? "" : actionData?.message} />
        <PasswordResetForm isLoading={isLoading} />
      </section>
      <div className="font-bold text-red-500 mt-8">
        ※ デモ環境では実際には送信されません
      </div>
    </div>
  );
}

function PasswordResetForm({ isLoading }: { isLoading: boolean }) {
  const submit = useSubmit();
  const form = useForm({
    defaultValues: {
      email: "admin@example.com",

      password: "password",
    },
    resolver: zodResolver(resetParamSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (isLoading) return;

    submit(data, { method: "POST", encType: "application/json" });
  });

  return (
    <Card className="p-8">
      <Form
        method="POST"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        <InputWithLabel
          type="email"
          label="メールアドレス"
          autoComplete="email"
          aria-invalid={!!form.formState.errors.email}
          {...form.register("email")}
          error={isLoading ? "" : form.formState.errors.email?.message}
        />
        <Button
          aria-disabled={isLoading}
          className="aria-disabled:opacity-50 aria-disabled:pointer-event-none aria-disabled:cursor-default"
        >
          {isLoading ? (
            <>
              <span className="mr-2">送信中です</span>
              <ReloadIcon
                className="animate-spin motion-reduce:hidden"
                aria-hidden
              />
            </>
          ) : (
            "パスワードリセット URL を送信する"
          )}
        </Button>
      </Form>
    </Card>
  );
}
