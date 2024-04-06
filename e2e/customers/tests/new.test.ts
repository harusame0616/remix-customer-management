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
  test("未入力で登録できる", async ({ customerNewPage }) => {
    const customerDetailPage = await customerNewPage.register();

    await expect(customerDetailPage.nameLocator).toHaveText(
      CustomerDetailPage.NO_INPUT_TEXT,
    );
    await expect(customerDetailPage.nameKanaLocator).toHaveText(
      CustomerDetailPage.NO_INPUT_TEXT,
    );
    await expect(customerDetailPage.sexLocator).toHaveText("その他");
    await expect(customerDetailPage.birthdayLocator).toHaveText(
      CustomerDetailPage.NO_INPUT_TEXT,
    );
    await expect(customerDetailPage.emailLocator).toHaveText(
      CustomerDetailPage.NO_INPUT_TEXT,
    );
    await expect(customerDetailPage.phoneLocator).toHaveText(
      CustomerDetailPage.NO_INPUT_TEXT,
    );
    await expect(customerDetailPage.mobilePhoneLocator).toHaveText(
      CustomerDetailPage.NO_INPUT_TEXT,
    );
    await expect(customerDetailPage.urlLocator).toHaveText(
      CustomerDetailPage.NO_INPUT_TEXT,
    );
    await expect(customerDetailPage.postCodeLocator).toHaveText(
      CustomerDetailPage.NO_INPUT_TEXT,
    );
    await expect(customerDetailPage.addressLocator).toHaveText(
      CustomerDetailPage.NO_INPUT_TEXT,
    );
    await expect(customerDetailPage.noteLocator).toHaveText(
      CustomerDetailPage.NO_INPUT_TEXT,
    );
    await expect(customerDetailPage.registeredAtLocator).toHaveText(
      /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/,
    );
  });

  test("全ての項目を入力して登録できる", async ({ customerNewPage }) => {
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

    const customerDetailPage = await customerNewPage.register({
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

    await expect(customerDetailPage.nameLocator).toHaveText(name);
    await expect(customerDetailPage.nameKanaLocator).toHaveText(nameKana);
    await expect(customerDetailPage.sexLocator).toHaveText(sex);
    await expect(customerDetailPage.birthdayLocator).toHaveText(birthday);
    await expect(customerDetailPage.emailLocator).toHaveText(email);
    await expect(customerDetailPage.phoneLocator).toHaveText(phone);
    await expect(customerDetailPage.mobilePhoneLocator).toHaveText(mobilePhone);
    await expect(customerDetailPage.urlLocator).toHaveText(url);
    await expect(customerDetailPage.postCodeLocator).toHaveText(postCode);
    await expect(customerDetailPage.addressLocator).toHaveText(address);
    await expect(customerDetailPage.noteLocator).toHaveText(note);
    await expect(customerDetailPage.registeredAtLocator).toHaveText(
      /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/,
    );
  });
});
