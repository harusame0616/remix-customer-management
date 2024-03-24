import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {
      title: "パスワードリセット - 顧客管理システム",
    },
  ];
};

export default function Index() {
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
        <h2 className="text-center mb-8">メールを送信しました</h2>
        <p>
          メールアドレスが登録済みの場合、パスワードリセット用の URL
          が送付されますので、URL
          の手順に沿ってパスワードリセット手続きをお進めください。
        </p>
        <p className="mt-4">
          メールが届かない場合は、メールアドレスが間違っているか、迷惑メールフォルダに入っている可能性がありますのでご確認ください。
        </p>

        <Link to="/login" className="w-full text-center block mt-8">
          ログインページへ
        </Link>
      </section>
      <div className="mt-8 font-bold text-red-500">
        ※ デモ環境では実際に送信されていません
      </div>
    </div>
  );
}
