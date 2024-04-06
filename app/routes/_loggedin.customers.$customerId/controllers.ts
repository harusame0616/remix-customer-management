import { defer, LoaderFunctionArgs } from "@remix-run/node";
import { queryCustomer } from "./queries";

export async function loader({ params }: LoaderFunctionArgs) {
  const { customerId } = params;

  if (!customerId) {
    throw new Response("error", { status: 400 });
  }
  return defer({
    success: true,
    customer: queryCustomer(customerId),
  });
}

export type Loader = typeof loader;
