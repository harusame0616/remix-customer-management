import { test as base, expect } from "@playwright/test";
import { CustomerListPage } from "../pages/customer-list-page";

const test = base.extend<{ customerListPage: CustomerListPage }>({
  customerListPage: async ({ page }, use) => {
    const customerListPage = await CustomerListPage.goTo(page);
    await use(customerListPage);
  },
});

test.describe("ソート", () => {
  test("デフォルトでヘッダーに昇順が表示される", async ({
    customerListPage,
  }) => {
    await expect(customerListPage.sortedHeader).toContainText("名前");
    await expect(
      customerListPage.sortedHeader.getByRole("img", { name: "昇順" }),
    ).toBeVisible();
    await expect(customerListPage.sortedHeader).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });
});

test.describe("検索", () => {
  test("名前と住所と備考からキーワード検索できる", async ({
    customerListPage,
  }) => {
    await customerListPage.search({ keyword: "キーワード検索テスト" });

    await expect(customerListPage.rows).toHaveCount(3);
  });
});
