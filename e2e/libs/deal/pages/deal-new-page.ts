import { Page } from "@playwright/test";
import { DealEditFormPage } from "./deal-edit-form-page";

type RegisterParams = Parameters<DealEditFormPage["input"]>[0];

export class DealNewPage extends DealEditFormPage {
  constructor(protected page: Page) {
    super(page);
  }

  async register(params: RegisterParams) {
    await this.input(params);
    return await this.save();
  }

  static async goto(page: Page) {
    await page.goto("/deals/new");
    return new DealNewPage(page);
  }
}
