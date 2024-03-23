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

test.describe("検索", () => {
  test("タイトルと本文からキーワード検索できる", async ({ dealListPage }) => {
    await dealListPage.search({ keyword: "キーワード検索テスト" });

    await expect(dealListPage.rows).toHaveCount(2);
  });

  test("検索で絞り込める", async ({ dealListPage }) => {
    // すべての条件が反映されていると1件のみ検出
    await dealListPage.search({
      keyword: "絞り込みテスト",
      statuses: ["完了"],
      platforms: ["その他"],
      from: "2022-01-01",
      to: "2022-01-01",
    });

    await expect(dealListPage.rows).toHaveCount(1);
  });
});
