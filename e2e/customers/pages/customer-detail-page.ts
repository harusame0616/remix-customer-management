import { Page } from "@playwright/test";

export class CustomerDetailPage {
  static readonly PATH_PATTERN = /\/customers\/([a-zA-Z0-9_-]+)(?:\?.*)?$/;

  constructor(private page: Page) {}
}
