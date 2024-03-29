import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "ユーザー一覧 - 顧客管理システム" }];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>ユーザー一覧</h1>
    </div>
  );
}
