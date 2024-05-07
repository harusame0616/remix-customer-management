import { type MetaFunction } from "@remix-run/node";
import { DemoDescription } from "~/components/demo-description";
import { LoginQRCode } from "~/components/login-qr-code";

export const meta: MetaFunction = () => {
  return [{ title: "トップ - 顧客管理システム" }];
};

export default function Index() {
  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
      className="flex justify-center p-8"
    >
      <div className="max-w-2xl grow">
        <div className="flex flex-col items-center">
          <h2>モバイル用 QR コード</h2>
          <LoginQRCode />
        </div>
        <DemoDescription />
      </div>
    </div>
  );
}
