import { Page } from "@playwright/test";
import { CustomerDetailPage } from "./customer-detail-page";

export const SexLabels = ["男性", "女性", "その他", "不明"] as const;
export type SexLabel = (typeof SexLabels)[number];

export class CustomerNewPage {
  static readonly PATH = "/customers/new";

  protected readonly nameLocator;
  protected readonly nameKanaLocator;
  protected readonly birthdayLocator;
  protected readonly emailLocator;
  protected readonly phoneLocator;
  protected readonly mobilePhoneLocator;
  protected readonly urlLocator;
  protected readonly postCodeLocator;
  protected readonly addressLocator;
  protected readonly noteLocator;
  protected readonly submitButtonLocator;

  constructor(
    protected page: Page,
    { submitLabel }: { submitLabel: string } = { submitLabel: "登録する" },
  ) {
    this.nameLocator = page.getByRole("textbox", { name: "名前（任意）" });
    this.nameKanaLocator = page.getByRole("textbox", {
      name: "名前（かな）（任意）",
    });
    this.birthdayLocator = page.getByLabel("誕生日");
    this.emailLocator = page.getByRole("textbox", {
      name: "メールアドレス",
    });
    this.phoneLocator = page.getByRole("textbox", {
      name: "電話番号（任意）",
      exact: true, // 携帯電話番号との区別
    });
    this.mobilePhoneLocator = page.getByRole("textbox", {
      name: "携帯電話番号（任意）",
    });
    this.urlLocator = page.getByRole("textbox", {
      name: "URL",
    });
    this.postCodeLocator = page.getByRole("textbox", {
      name: "郵便番号",
    });
    this.addressLocator = page.getByRole("textbox", {
      name: "住所",
    });
    this.noteLocator = page.getByRole("textbox", {
      name: "備考",
    });
    this.submitButtonLocator = page.getByRole("button", { name: submitLabel });
  }

  async register({
    name,
    nameKana,
    sex,
    birthday,
    email,
    phone,
    mobilePhone,
    url,
    postCode,
    address,
    note,
  }: Partial<{
    name?: string;
    nameKana?: string;
    sex?: SexLabel;
    birthday?: string;
    email?: string;
    phone?: string;
    mobilePhone?: string;
    url?: string;
    postCode?: string;
    address?: string;
    note?: string;
  }> = {}) {
    if (name !== undefined) {
      await this.nameLocator.fill(name);
    }
    if (nameKana !== undefined) {
      await this.nameKanaLocator.fill(nameKana);
    }
    if (sex !== undefined) {
      await this.page.getByRole("radio", { name: sex }).check();
    }
    if (birthday !== undefined) {
      await this.birthdayLocator.fill(birthday);
    }
    if (email !== undefined) {
      await this.emailLocator.fill(email);
    }
    if (phone !== undefined) {
      await this.phoneLocator.fill(phone);
    }
    if (mobilePhone !== undefined) {
      await this.mobilePhoneLocator.fill(mobilePhone);
    }
    if (url !== undefined) {
      await this.urlLocator.fill(url);
    }
    if (postCode !== undefined) {
      await this.postCodeLocator.fill(postCode);
    }
    if (address !== undefined) {
      await this.addressLocator.fill(address);
    }
    if (note !== undefined) {
      await this.noteLocator.fill(note);
    }

    await this.submitButtonLocator.click();

    return new CustomerDetailPage(this.page);
  }

  async goTo() {
    await this.page.goto(CustomerNewPage.PATH);
  }

  static async goTo(page: Page) {
    const customerNewPage = new CustomerNewPage(page);
    await customerNewPage.goTo();
    return customerNewPage;
  }
}
