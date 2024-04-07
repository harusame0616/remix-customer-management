import { Page } from "@playwright/test";

export class CustomerListPage {
  static readonly PATH = "/customers";
  static readonly NO_INPUT_TEXT = "（入力なし）";

  sortedHeader;
  rows;

  constructor(private page: Page) {
    this.sortedHeader = this.page
      .getByRole("cell")
      .filter({ has: this.page.getByRole("button", { name: /昇順|降順/ }) });
    this.rows = this.page.getByRole("row").filter({
      // columnheader で要素を取得することができないので暫定的に詳細リンクがある行をデータ行とする
      has: this.page.getByRole("link", { name: "詳細" }),
    });
  }

  async search({ keyword }: { keyword?: string }) {
    await this.page.getByRole("button", { name: "検索" }).click();

    if (keyword) {
      await this.page
        .getByRole("textbox", { name: "キーワード" })
        .fill(keyword);
    }

    await this.page.getByRole("button", { name: "検索" }).click();
    await this.page.waitForURL(/\?/);
  }

  async goTo() {
    await this.page.goto(CustomerListPage.PATH);
  }

  static async goTo(page: Page) {
    const customerListPage = new CustomerListPage(page);
    await customerListPage.goTo();

    return customerListPage;
  }

  async wait() {
    await this.page.waitForURL(CustomerListPage.PATH);
  }
}
