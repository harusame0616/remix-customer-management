import { PrismaClient } from "@prisma/client";
import z from "zod";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const vercelEnvSchema = z
  .enum(["development", "preview", "production"])
  .optional()
  .transform((val) => val || "development");
const vercelCommitRefSchema = z
  .string()
  .optional()
  .transform((val) => val || "default");
const databaseUrlSchema = z.string();

const repoName = "remix-customer-management";
const env = vercelEnvSchema.parse(process.env.VERCEL_ENV);
const branchName = vercelCommitRefSchema.parse(
  process.env.VERCEL_GIT_COMMIT_REF,
);
const databaseUrl = databaseUrlSchema.parse(process.env.DATABASE_URL);

const datasourceUrl =
  env === "development"
    ? databaseUrl
    : `${databaseUrl}&schema=${repoName}_${env}_${branchName.replace(/[\W]/g, "_")}`;

const prisma =
  global.prisma ||
  new PrismaClient({
    // プレビュー環境ではブランチごとにスキーマが別れているため参照先を切り替える
    // スキーマ名はブランチ名の「英数字_」以外を _ に置換したもの name/foo -> name_foo
    datasourceUrl,
  });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
