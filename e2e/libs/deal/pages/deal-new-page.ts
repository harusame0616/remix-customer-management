import { Page } from "@playwright/test";
import { DealEditFormPage } from "./deal-edit-form-page";

export class DealNewPage extends DealEditFormPage {
  constructor(protected page: Page) {
    super(page);
  }

  static async goto(page: Page) {
    await page.goto("/deals/new");
    return new DealNewPage(page);
  }
}
