import * as qrcode from "qrcode";
import { useEffect, useState } from "react";

export function LoginQRCode() {
  const [loginQRCode, setLoginQRCode] = useState<string>();

  useEffect(() => {
    qrcode.toDataURL(window.location.href).then((url) => {
      setLoginQRCode(url);
    });
  }, []);

  return <img src={loginQRCode} alt="ログインページへアクセス用のQRコード" />;
}
