import { createCookie } from "@remix-run/node";

export const signedInUser = createCookie("signed-in-user", {
  maxAge: 60 * 60 * 24 * 365,
  secrets: ["sample-secret-key"], // デモ用なので直書き
});
