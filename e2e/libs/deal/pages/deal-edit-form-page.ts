import { Page } from "@playwright/test";
import { DealStatus, DealPlatform } from "../types";
import { DealDetailPage } from "./deal-detail-page";

export class DealEditFormPage {
  protected readonly titleLocator;
  protected readonly contentLocator;
  protected readonly urlLocator;
  protected readonly deadlineLocator;
  protected readonly submitButtonLocator;

  constructor(
    protected page: Page,
    { submitLabel }: { submitLabel: string } = { submitLabel: "登録する" },
  ) {
    this.titleLocator = page.getByRole("textbox", { name: "タイトル" });
    this.contentLocator = page.getByRole("textbox", { name: "取引内容" });
    this.urlLocator = page.getByRole("textbox", { name: "URL" });
    this.deadlineLocator = page.getByLabel("締め切り");
    this.submitButtonLocator = page.getByRole("button", { name: submitLabel });
  }

  async input({
    title,
    content,
    url,
    deadline,
    status,
    platform,
    customerName,
  }: Partial<{
    title: string;
    content: string;
    url: string;
    deadline: string;
    status: DealStatus;
    platform: DealPlatform;
    customerName: string;
  }>) {
    if (title) {
      await this.titleLocator.fill(title);
    }
    if (content) {
      await this.contentLocator.fill(content);
    }
    if (platform) {
      await this.page.getByRole("radio", { name: platform }).check();
    }
    if (url) {
      await this.urlLocator.fill(url);
    }
    if (deadline) {
      await this.deadlineLocator.fill(deadline);
    }
    if (status) {
      await this.page.getByRole("radio", { name: status }).check();
    }
    if (customerName) {
      await this.searchCustomer(customerName);
      await this.selectCustomerByName(customerName);
    }
  }

  goTo() {
    return this.page.goto("/deals/new");
  }

  async save() {
    await this.submitButtonLocator.click();
    const dealDetailPage = new DealDetailPage(this.page);
    await dealDetailPage.wait();
    return dealDetailPage;
  }

  async searchCustomer(keyword: string) {
    await this.page.getByRole("button", { name: "顧客を選択" }).click();
    await this.page.getByRole("textbox", { name: "キーワード" }).fill(keyword);
    await this.page.getByRole("button", { name: "検索" }).click();
  }

  async selectCustomerByName(name: string) {
    await this.page
      .getByRole("row")
      .filter({ hasText: name })
      .getByRole("button", { name: "選択" })
      .click();
  }
}
