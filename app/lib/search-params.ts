import queryString from "query-string";

export function safeParseQueryString<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Validator extends { safeParse: (v: any) => any },
>(query: string, validator: Validator): ReturnType<Validator["safeParse"]> {
  return validator.safeParse(
    queryString.parse(query, { arrayFormat: "comma" }),
  );
}
