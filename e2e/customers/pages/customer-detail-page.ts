import { Page } from "@playwright/test";
import { CustomerListPage } from "./customer-list-page";

export class CustomerDetailPage {
  static readonly PATH_PATTERN = /\/customers\/([a-zA-Z0-9_-]+)(?:\?.*)?$/;
  static readonly NO_INPUT_TEXT = "（入力なし）";

  readonly nameLocator;
  readonly nameKanaLocator;
  readonly sexLocator;
  readonly birthdayLocator;
  readonly emailLocator;
  readonly phoneLocator;
  readonly mobilePhoneLocator;
  readonly urlLocator;
  readonly postCodeLocator;
  readonly addressLocator;
  readonly noteLocator;
  readonly registeredAtLocator;

  constructor(private page: Page) {
    this.nameLocator = page.getByTestId("profile0").getByRole("definition");
    this.nameKanaLocator = page.getByTestId("profile1").getByRole("definition");
    this.sexLocator = page.getByTestId("profile2").getByRole("definition");
    this.birthdayLocator = page.getByTestId("profile3").getByRole("definition");
    this.emailLocator = page.getByTestId("profile4").getByRole("definition");
    this.phoneLocator = page.getByTestId("profile5").getByRole("definition");
    this.mobilePhoneLocator = page
      .getByTestId("profile6")
      .getByRole("definition");
    this.urlLocator = page.getByTestId("profile7").getByRole("definition");
    this.postCodeLocator = page.getByTestId("profile8").getByRole("definition");
    this.addressLocator = page.getByTestId("profile9").getByRole("definition");
    this.noteLocator = page.getByTestId("profile10").getByRole("definition");
    this.registeredAtLocator = page
      .getByTestId("profile11")
      .getByRole("definition");
  }

  async delete() {
    await this.page.getByRole("button", { name: "削除" }).click();
    await this.page.getByRole("button", { name: "削除する" }).click();

    await this.page.waitForURL("/customers");
    return new CustomerListPage(this.page);
  }
}
