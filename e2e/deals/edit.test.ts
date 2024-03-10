import { test as base, expect } from "@playwright/test";
import { generateUniqueStr, generateUniqueURL } from "e2e/libs/str";
import { DealDetailPage } from "e2e/libs/deal/pages/deal-detail-page";
import { DealNewPage } from "e2e/libs/deal/pages/deal-new-page";
import { DealStatusLabel } from "e2e/libs/deal/constants";
import { DealEditPage } from "e2e/libs/deal/pages/deal-edit-page";

const test = base.extend<{ dealEditPage: DealEditPage }>({
  dealEditPage: async ({ page }, use) => {
    const dealNewPage = new DealNewPage(page);
    await dealNewPage.goTo();
    await dealNewPage.input({ title: generateUniqueStr() });
    await dealNewPage.save();

    const dealDetailPage = new DealDetailPage(page);
    await dealDetailPage.goToEdit();

    await use(new DealEditPage(page));
  },
});

test.describe("編集できる", () => {
  test("タイトルのみで編集できる", async ({ page, dealEditPage }) => {
    const title = generateUniqueStr();
    await dealEditPage.input({ title });
    await dealEditPage.save();

    const dealDetailPage = new DealDetailPage(page);
    await Promise.all([
      expect(dealDetailPage.titleLocator).toHaveText(title),
      expect(dealDetailPage.customerLocator).toHaveText("-"),
      expect(dealDetailPage.deadlineLocator).toHaveText("-"),
      expect(dealDetailPage.platformLocator).toHaveText("その他"),
      expect(dealDetailPage.urlLocator).toHaveText("-"),
      expect(dealDetailPage.statusLocator).toHaveText(
        DealStatusLabel.UnderConsideration,
      ),
      expect(dealDetailPage.contentLocator).toHaveText("-"),
    ]);
  });

  test("全ての項目を入力して編集できる", async ({ dealEditPage, page }) => {
    const title = generateUniqueStr();
    const content = generateUniqueStr();
    const url = generateUniqueURL();
    const deadline = "2023-12-31";
    const status = DealStatusLabel.Completed;

    await dealEditPage.input({ title, content, url, deadline, status });
    await dealEditPage.save();

    const dealDetailPage = new DealDetailPage(page);
    await Promise.all([
      expect(dealDetailPage.titleLocator).toHaveText(title),
      expect(dealDetailPage.customerLocator).toHaveText("-"),
      expect(dealDetailPage.deadlineLocator).toHaveText(
        deadline.replace(/-/g, "/"),
      ),
      expect(dealDetailPage.platformLocator).toHaveText("その他"),
      expect(
        dealDetailPage.urlLocator.getByRole("link", { name: url }),
      ).toBeVisible(),
      expect(dealDetailPage.statusLocator).toHaveText(status),
      expect(dealDetailPage.contentLocator).toHaveText(content),
    ]);
  });
});
