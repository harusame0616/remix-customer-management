import { test as base, expect } from "@playwright/test";
import { DealNewPage } from "e2e/libs/deal/pages/deal-new-page";
import { generateUniqueStr } from "e2e/libs/str";
import { CustomerDetailPage } from "../pages/customer-detail-page";
import { CustomerNewPage } from "../pages/customer-new-page";
import { CUSTOMER_NAME_MAX_LENGTH } from "../customer";

const test = base.extend<{ customerDetailPage: CustomerDetailPage }>({
  async customerDetailPage({ page, context }, use) {
    const customerName = generateUniqueStr(CUSTOMER_NAME_MAX_LENGTH);
    const customerNewPage = await CustomerNewPage.goto(page);
    const customerDetailPage = await customerNewPage.register({
      name: customerName,
    });

    const page2 = await context.newPage();
    const title = generateUniqueStr();
    const dealNewPage = await DealNewPage.goto(page2);
    await dealNewPage.register({
      title,
      customerName,
    });
    await page2.close();
    use(customerDetailPage);
  },
});

test("削除できる", async ({ customerDetailPage }) => {
  const customerName = await customerDetailPage.nameLocator.textContent();
  if (!customerName) {
    throw new Error("顧客の名前が不正");
  }

  const customerListPage = await customerDetailPage.delete();
  await customerListPage.search({ keyword: customerName });
  await expect(customerListPage.rows).toHaveCount(0);
});
