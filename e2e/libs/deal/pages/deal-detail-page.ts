import { expect, Page } from "@playwright/test";
import { DealListPage } from "./deal-list-page";

export class DealDetailPage {
  public readonly titleLocator;
  public readonly contentLocator;
  public readonly urlLocator;
  public readonly statusLocator;
  public readonly deadlineLocator;
  public readonly platformLocator;
  public readonly customerLocator;
  public readonly editLinkLocator;

  constructor(private page: Page) {
    this.titleLocator = page.getByRole("heading", { level: 2 });
    this.customerLocator = this.page.getByRole("definition").first();
    this.deadlineLocator = this.page.getByRole("definition").nth(1);
    this.platformLocator = this.page.getByRole("definition").nth(2);
    this.urlLocator = this.page.getByRole("definition").nth(3);
    this.statusLocator = this.page.getByRole("definition").nth(4);
    this.contentLocator = this.page
      .getByRole("region", { name: "取引内容" })
      .getByRole("paragraph");
    this.editLinkLocator = this.page.getByRole("link", { name: "編集" });
  }

  goToEdit() {
    return this.editLinkLocator.click();
  }

  async delete() {
    await this.page.getByRole("button", { name: "削除" }).click();
    await this.page.getByRole("button", { name: "削除する" }).click();

    await this.page.waitForURL("/deals");
    return new DealListPage(this.page);
  }

  async wait() {
    await expect(this.page).toHaveTitle("取引詳細");
  }
}
