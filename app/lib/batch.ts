import { LoaderFunctionArgs } from "@remix-run/node";

export function bathAuthLoaderMiddleware<LoaderResponse>(
  loader: (loaderFunctionArgs: LoaderFunctionArgs) => LoaderResponse,
): (loaderFunctionArgs: LoaderFunctionArgs) => Promise<LoaderResponse> {
  return async function (
    loaderFunctionArgs: LoaderFunctionArgs,
  ): Promise<ReturnType<typeof loader>> {
    if (
      `Bearer ${process.env.CRON_SECRET}` !==
      loaderFunctionArgs.request.headers.get("authorization")
    ) {
      throw new Response(null, { status: 401 });
    }

    return await loader(loaderFunctionArgs);
  };
}
