import { Page } from "@playwright/test";

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

  waitForPage() {
    return this.page.waitForURL(/\/deals\/.+/);
  }
}
