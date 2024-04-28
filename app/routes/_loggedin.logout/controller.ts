import { redirect } from "@remix-run/node";
import { signedInUser } from "~/cookies.server";

export async function loader() {
  return redirect("/", {
    headers: {
      "Set-Cookie": await signedInUser.serialize(
        { role: "", email: "" },
        { maxAge: -1 },
      ),
    },
  });
}
