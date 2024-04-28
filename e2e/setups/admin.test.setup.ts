import { test as setup } from "@playwright/test";
import { LoginPage } from "e2e/libs/login/pages/login-page";

const authFile = "playwright/.auth/admin.json";

setup("authenticate", async ({ page }) => {
  const loginPage = await LoginPage.goto(page);
  await loginPage.login("admin@example.com", "password");

  await page.context().storageState({ path: authFile });
});
