import { Page } from "@playwright/test";
import { Status } from "../types";

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
  }: Partial<{
    title: string;
    content: string;
    url: string;
    deadline: string;
    status: Status;
  }>) {
    if (title) {
      await this.titleLocator.fill(title);
    }
    if (content) {
      await this.contentLocator.fill(content);
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
  }

  goTo() {
    return this.page.goto("/deals/new");
  }

  async save() {
    await this.submitButtonLocator.click();
  }
}
