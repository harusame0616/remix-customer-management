import { test as base, expect } from "@playwright/test";
import {
  CUSTOMER_ADDRESS_MAX_LENGTH,
  CUSTOMER_EMAIL_MAX_LENGTH,
  CUSTOMER_NAME_KANA_MAX_LENGTH,
  CUSTOMER_NAME_MAX_LENGTH,
  CUSTOMER_NOTE_MAX_LENGTH,
  CUSTOMER_URL_MAX_LENGTH,
} from "e2e/customers/customer";
import { CustomerDetailPage } from "e2e/customers/pages/customer-detail-page";
import {
  CustomerNewPage,
  SexLabel,
} from "e2e/customers/pages/customer-new-page";
import {
  generateUniqueEmail,
  generateUniqueStr,
  generateUniqueURL,
} from "e2e/libs/str";

const test = base.extend<{ customerNewPage: CustomerNewPage }>({
  customerNewPage: async ({ page }, use) => {
    const customerNewPage = await CustomerNewPage.goTo(page);
    await use(customerNewPage);
  },
});

test.describe("登録できる", () => {
  test("未入力で登録できる", async ({ page, customerNewPage }) => {
    await customerNewPage.register();

    expect(page).toHaveURL(CustomerDetailPage.PATH_PATTERN);
    // TODO: 正しい値で登録されていることを確認
  });

  test("全ての項目を入力して登録できる", async ({ customerNewPage, page }) => {
    const name = generateUniqueStr(CUSTOMER_NAME_MAX_LENGTH);
    const nameKana = generateUniqueStr(CUSTOMER_NAME_KANA_MAX_LENGTH);
    const sex: SexLabel = "男性";
    const birthday = "1989-06-16";
    const email = generateUniqueEmail(CUSTOMER_EMAIL_MAX_LENGTH);
    const phone = "03-1234-5678";
    const mobilePhone = "070-9099-3112";
    const url = generateUniqueURL(CUSTOMER_URL_MAX_LENGTH);
    const address = generateUniqueStr(CUSTOMER_ADDRESS_MAX_LENGTH);
    const note = generateUniqueStr(CUSTOMER_NOTE_MAX_LENGTH);
    const postCode = "000-0000";

    await customerNewPage.register({
      name,
      nameKana,
      sex,
      birthday,
      email,
      phone,
      mobilePhone,
      url,
      address,
      note,
      postCode,
    });

    await expect(page).toHaveURL(CustomerDetailPage.PATH_PATTERN);
    // TODO: 正しい値で登録されていることを確認
  });
});
