import { test as base, expect } from "@playwright/test";
import { generateUniqueStr } from "e2e/libs/str";
import { DealDetailPage } from "e2e/libs/deal/pages/deal-detail-page";
import { DealEditFormPage } from "e2e/libs/deal/pages/deal-edit-form-page";
import { DealPlatformLabel, DealStatusLabel } from "e2e/libs/deal/constants";

const test = base.extend<{ dealNewPage: DealEditFormPage }>({
  dealNewPage: async ({ page }, use) => {
    await page.goto("/deals/new");
    await use(new DealEditFormPage(page));
  },
});

test.describe("登録できる", () => {
  test("タイトルのみで登録できる", async ({ page, dealNewPage }) => {
    const title = generateUniqueStr();
    await dealNewPage.input({ title });
    await dealNewPage.save();

    const dealDetailPage = new DealDetailPage(page);
    await Promise.all([
      expect(dealDetailPage.titleLocator).toHaveText(title),
      expect(dealDetailPage.customerLocator).toHaveText("-"),
      expect(dealDetailPage.deadlineLocator).toHaveText("-"),
      expect(dealDetailPage.platformLocator).toHaveText(
        DealPlatformLabel.Others,
      ),
      expect(dealDetailPage.urlLocator).toHaveText("-"),
      expect(dealDetailPage.statusLocator).toHaveText(
        DealStatusLabel.UnderConsideration,
      ),
      expect(dealDetailPage.contentLocator).toHaveText("-"),
    ]);
  });

  test("全ての項目を入力して登録できる", async ({ dealNewPage, page }) => {
    const title = generateUniqueStr();
    const content = generateUniqueStr();
    const platform = DealPlatformLabel.Coconala;
    const url = "https://example.com/" + generateUniqueStr();
    const deadline = "2023-12-31";
    const status = DealStatusLabel.Completed;

    await dealNewPage.input({
      title,
      content,
      url,
      deadline,
      status,
      platform,
    });
    await dealNewPage.save();

    const dealDetailPage = new DealDetailPage(page);
    await Promise.all([
      expect(dealDetailPage.titleLocator).toHaveText(title),
      expect(dealDetailPage.customerLocator).toHaveText("-"),
      expect(dealDetailPage.deadlineLocator).toHaveText(
        deadline.replace(/-/g, "/"),
      ),
      expect(dealDetailPage.platformLocator).toHaveText(platform),
      expect(
        dealDetailPage.urlLocator.getByRole("link", { name: url }),
      ).toBeVisible(),
      expect(dealDetailPage.statusLocator).toHaveText(status),
      expect(dealDetailPage.contentLocator).toHaveText(content),
    ]);
  });
});
