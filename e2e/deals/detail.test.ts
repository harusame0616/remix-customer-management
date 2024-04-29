import { test as base, expect } from "@playwright/test";
import { DealDetailPage } from "e2e/libs/deal/pages/deal-detail-page";
import { DealNewPage } from "e2e/libs/deal/pages/deal-new-page";
import { generateUniqueStr } from "e2e/libs/str";

const test = base.extend<{ dealDetailPage: DealDetailPage }>({
  async dealDetailPage({ page }, use) {
    const title = generateUniqueStr();
    const dealNewPage = await DealNewPage.goto(page);
    const dealDetailPage = await dealNewPage.register({ title });
    use(dealDetailPage);
  },
});

test("削除できる", async ({ dealDetailPage }) => {
  const dealTitle = await dealDetailPage.titleLocator.textContent();
  if (!dealTitle) {
    throw new Error("取引のタイトルが不正");
  }

  const dealListPage = await dealDetailPage.delete();
  await dealListPage.search({ keyword: dealTitle });
  await expect(dealListPage.rows).toHaveCount(0);
});
