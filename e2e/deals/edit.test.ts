import { test as base, expect } from "@playwright/test";
import { generateUniqueStr, generateUniqueURL } from "e2e/libs/str";
import { DealDetailPage } from "e2e/libs/deal/pages/deal-detail-page";
import { DealNewPage } from "e2e/libs/deal/pages/deal-new-page";
import { DealPlatformLabel, DealStatusLabel } from "e2e/libs/deal/constants";
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
  test("タイトルのみで編集できる", async ({ dealEditPage }) => {
    const title = generateUniqueStr();
    await dealEditPage.input({ title });
    const dealDetailPage = await dealEditPage.save();

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

  test("全ての項目を入力して編集できる", async ({ dealEditPage }) => {
    const title = generateUniqueStr();
    const content = generateUniqueStr();
    const platform = DealPlatformLabel.Coconala;
    const url = generateUniqueURL();
    const deadline = "2023-12-31";
    const status = DealStatusLabel.Completed;
    const customerName = "佐藤 花子";

    await dealEditPage.input({
      title,
      content,
      url,
      deadline,
      status,
      platform,
    });
    await dealEditPage.searchCustomer(customerName);
    await dealEditPage.selectCustomerByName(customerName);

    const dealDetailPage = await dealEditPage.save();
    await Promise.all([
      expect(dealDetailPage.titleLocator).toHaveText(title),
      expect(dealDetailPage.customerLocator).toHaveText(customerName),
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
