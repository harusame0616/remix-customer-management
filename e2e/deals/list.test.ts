import { test as base, expect } from "@playwright/test";
import { DealListPage } from "e2e/libs/deal/pages/deal-list-page";

const test = base.extend<{ dealListPage: DealListPage }>({
  dealListPage: async ({ page }, use) => {
    const dealListPage = new DealListPage(page);
    await dealListPage.goTo();
    await page.waitForURL(/deals/);
    await use(dealListPage);
  },
});

test.describe("ソート", () => {
  test("デフォルトで登録日ヘッダーに昇順が表示される", async ({
    dealListPage,
  }) => {
    await expect(dealListPage.sortedHeader).toContainText("登録日");
    await expect(
      dealListPage.sortedHeader.getByRole("img", { name: "昇順" }),
    ).toBeVisible();
    await expect(dealListPage.sortedHeader).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });
});
