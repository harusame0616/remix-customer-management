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
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "~/domains/auth-user/constants";
import { useIsSubmitting } from "~/hooks/use-is-loading";
import { login } from "~/lib/auth";

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
    ? redirect("/")
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
    <div className="flex items-center flex-col mx-8">
      <section
        className="mt-[10%] max-w-md w-full"
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
      <DemoDescription />
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

function DemoDescription() {
  return (
    <section
      aria-labelledby="demo-description-text"
      className="max-w-2xl mt-24"
    >
      <h2 id="demo-description-text" className="text-lg font-bold mb-4">
        顧客管理システムのデモ環境説明
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className={`text-lg mb-2 before:content-["■"]`}>
            本システムについて
          </h3>
          <p className="flex flex-col">
            <span>
              本システムは架空の仕様を想定した顧客管理システムのデモ環境です。
            </span>
            <span>
              ご自由にお試しいただけますが、誰でも閲覧・操作できるため実在するデータを入力するのはご遠慮ください。
            </span>
            <span>データは毎日リセットされます、ご了承ください</span>
          </p>
        </div>
        <div>
          <h3 className={`text-lg mb-2 before:content-["■"]`}>機能</h3>
          <p>以下の機能がご利用いただけます。</p>
          <dl className="list-disc list-inside space-y-4 mt-4">
            <div>
              <dt>・ログイン機能</dt>
              <dd>
                事前にログイン登録してあるログインユーザーのメールアドレスとパスワードによってシステムの利用を制限するセキュリティー機能です。
                また、パスワードを忘れた場合のパスワードリセット機能も存在します（デモ環境では利用できません）。
              </dd>
            </div>
            <div>
              <dt>・権限管理機能</dt>
              <dd>
                ログインユーザーに権限を割り振って使用できる機能を制限する機能です。
              </dd>
            </div>
            <div>
              <dt>・顧客管理機能</dt>
              <dd>顧客を検索・閲覧・作成・編集・削除する機能です。</dd>
            </div>
            <div>
              <dt>・ログインユーザー管理機能</dt>
              <dd>
                ログインユーザーを検索・閲覧・作成・編集・削除する機能です。
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className={`text-lg mb-2 before:content-["■"]`}>
            ログインユーザーについて
          </h3>
          <p className="mb-4">
            メールアドレスは以下のいずれかを入力してください。
          </p>
          <dl className="space-y-4">
            <div>
              <dt>・管理者（全機能が利用可能）</dt>
              <dt>admin@example.com</dt>
            </div>
            <div>
              <dt>・編集者（顧客管理が利用可能）</dt>
              <dd>editor@example.com</dd>
            </div>
            <div>
              <dt>・閲覧者（顧客管理の検索・閲覧のみ利用可能）</dt>
              <dt>viewer@example.com</dt>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
