import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import {
  Link,
  Form as RemixForm,
  json,
  useActionData,
  useSubmit,
} from "@remix-run/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { ActionCard } from "~/components/action-card";
import { ErrorMessage } from "~/components/error-message";
import { FormInput } from "~/components/form-input";
import { LoginQRCode } from "~/components/login-qr-code";
import { Logo } from "~/components/logo";
import { Form as ShadcnForm } from "~/components/ui/form";
import { signedInUser } from "~/cookies.server";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "~/domains/auth-user/constants";
import { useIsSubmitting } from "~/hooks/use-is-loading";
import { login } from "~/lib/auth";
import { DemoDescription } from "../../components/demo-description";

export const meta: MetaFunction = () => {
  return [
    {
      title: "ログイン - 顧客管理システム",
      description: "ログインページです",
    },
  ];
};

const loginParamSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください。")
    .email("メールアドレスの形式で入力してください。"),
  password: z
    .string()
    .min(1, "パスワードを入力してください。")
    .min(
      PASSWORD_MIN_LENGTH,
      `パスワードは${PASSWORD_MIN_LENGTH}文字以上にしてください。`,
    )
    .max(
      PASSWORD_MAX_LENGTH,
      `パスワードは${PASSWORD_MAX_LENGTH}文字以下にしてください。`,
    ),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const loginParam = loginParamSchema.safeParse(await request.json());
  if (!loginParam.success) {
    return json(
      {
        success: false,
        message: loginParam.error.issues
          .map(({ message }) => message)
          .join("\n"),
      },
      { status: 400 },
    );
  }

  const loginResult = await login(loginParam.data);
  return loginResult.success
    ? redirect("/", {
        headers: {
          "Set-Cookie": await signedInUser.serialize({
            role: loginResult.role,
            email: loginParam.data.email,
          }),
        },
      })
    : json(
        {
          success: false,
          message:
            "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
        },
        { status: 401 },
      );
};

export default function Index() {
  const isSubmitting = useIsSubmitting();
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex items-center flex-col p-8 overflow-auto">
      <section
        className="mt-[5%] max-w-md w-full"
        aria-labelledby="login-section-text"
      >
        <h1 id="login-section-text" className="text-center mb-4">
          <Logo />
        </h1>
        <h2 className="text-center mb-1">ログイン</h2>
        <ErrorMessage message={isSubmitting ? "" : actionData?.message} />
        <LoginForm isSubmitting={isSubmitting} />
      </section>
      <div className="mt-12">
        モバイルアクセス用 URL
        <LoginQRCode />
      </div>
      <div className="max-w-2xl mt-8">
        <DemoDescription />
      </div>
    </div>
  );
}

function LoginForm({ isSubmitting }: { isSubmitting: boolean }) {
  const submit = useSubmit();
  const form = useForm<z.input<typeof loginParamSchema>>({
    defaultValues: {
      email: "admin@example.com",
      password: "password",
    },
    resolver: zodResolver(loginParamSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (isSubmitting) return;

    submit(data, { method: "POST", encType: "application/json" });
  });

  return (
    <ShadcnForm {...form}>
      <RemixForm onSubmit={handleSubmit} noValidate>
        <ActionCard
          actionLabel="ログイン"
          processingActonLabel="ログイン中です"
        >
          <FormInput
            control={form.control}
            label="メールアドレス"
            type="email"
            autoComplete="email"
            name="email"
            required
          />
          <FormInput
            control={form.control}
            label="パスワード"
            type="password"
            autoComplete="current-password"
            name="password"
            required
          />
        </ActionCard>
        <div className="mt-2 text-center">
          <Link to="/password-reset" className="mt-4">
            パスワードのリセット
          </Link>
        </div>
      </RemixForm>
    </ShadcnForm>
  );
}
