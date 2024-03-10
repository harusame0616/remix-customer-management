import { Page } from "@playwright/test";
import { DealEditFormPage } from "./deal-edit-form-page";

export class DealEditPage extends DealEditFormPage {
  constructor(protected page: Page) {
    super(page, { submitLabel: "編集する" });
  }
}
