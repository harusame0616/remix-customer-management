import { Page } from "@playwright/test";

const statusLabels = [
  "検討中",
  "提案中",
  "進行中",
  "完了",
  "キャンセル",
  "棄却",
] as const;
type StatusLabel = (typeof statusLabels)[number];

const platformLabels = ["その他", "coconala", "Lancers", "CloudWorks"];
type PlatformLabel = (typeof platformLabels)[number];

export class DealListPage {
  searchButton;
  sortedHeader;
  rows;
  constructor(private page: Page) {
    this.sortedHeader = this.page
      .getByRole("cell")
      .filter({ has: this.page.getByRole("button", { name: /昇順|降順/ }) });
    this.searchButton = this.page.getByRole("button", { name: "検索" });
    this.rows = this.page.getByRole("row").filter({
      // columnheader で要素を取得することができないので暫定的に詳細リンクがある行をデータ行とする
      has: this.page.getByRole("link", { name: "詳細" }),
    });
  }

  goTo() {
    return this.page.goto("/deals");
  }

  async search({
    keyword,
    statuses,
    platforms,
    from,
    to,
  }: {
    keyword?: string;
    statuses?: StatusLabel[];
    platforms?: PlatformLabel[];
    from?: string;
    to?: string;
  }) {
    await this.page.getByRole("button", { name: "検索" }).click();

    if (keyword) {
      await this.page
        .getByRole("textbox", { name: "キーワード" })
        .fill(keyword);
    }

    if (statuses) {
      for (const status of statusLabels) {
        const checkbox = this.page.getByRole("checkbox", { name: status });
        if (statuses.includes(status)) {
          await checkbox.check();
        } else {
          await checkbox.uncheck();
        }
      }
    }

    if (platforms) {
      for (const platform of platformLabels) {
        const checkbox = this.page.getByRole("checkbox", { name: platform });
        if (platforms.includes(platform)) {
          await checkbox.check();
        } else {
          await checkbox.uncheck();
        }
      }
    }

    if (from) {
      await this.page.getByLabel("from").fill(from);
    }

    if (to) {
      await this.page.getByLabel("to").fill(to);
    }

    await this.page.getByRole("button", { name: "検索" }).click();
    await this.page.waitForURL(/\?/);
  }
}
