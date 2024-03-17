import { Page } from "@playwright/test";

export class DealListPage {
  sortedHeader;
  constructor(private page: Page) {
    this.sortedHeader = this.page
      .getByRole("cell")
      .filter({ has: this.page.getByRole("button", { name: /昇順|降順/ }) });
  }

  goTo() {
    return this.page.goto("/deals");
  }
}
