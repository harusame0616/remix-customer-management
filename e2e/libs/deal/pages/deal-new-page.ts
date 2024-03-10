import { Page } from "@playwright/test";
import { DealEditFormPage } from "./deal-edit-form-page";

export class DealNewPage extends DealEditFormPage {
  constructor(protected page: Page) {
    super(page);
  }
}
