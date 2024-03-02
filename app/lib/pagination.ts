export const PER_PAGE = 20;
export function toPage(value: unknown): number {
  let pageNumber;
  if (typeof value === "number") {
    pageNumber = value;
  } else if (typeof value === "string") {
    pageNumber = typeof value === "string" ? parseInt(value, 10) : 1;
    if (isNaN(pageNumber)) {
      pageNumber = 1;
    }
  } else {
    return 1;
  }

  return pageNumber < 1 ? 1 : pageNumber;
}
