import { Page } from "@playwright/test";

export class LoginPage {
  public emailLocator;
  public passwordLocator;
  public loginButtonLocator;

  constructor(private page: Page) {
    this.emailLocator = page.getByRole("textbox", { name: "メールアドレス" });
    this.passwordLocator = page.getByLabel("パスワード（必須）", {
      exact: true,
    });
    this.loginButtonLocator = page.getByRole("button", { name: "ログイン" });
  }

  async login(email: string, password: string) {
    await this.emailLocator.fill(email);
    await this.passwordLocator.fill(password);
    await this.loginButtonLocator.click();

    await this.page.waitForURL("/");
    return this.page;
  }

  static async goto(page: Page) {
    await page.goto("/login");

    return new LoginPage(page);
  }
}
