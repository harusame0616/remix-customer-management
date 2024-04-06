import { Prisma, Sex } from "@prisma/client";

const customerSources: Prisma.CustomerCreateManyInput[] = [
  {
    customerId: "175c8968-010b-1d53-a51a-0583b990fe81",
    address: "",
    email: "",
    mobilePhone: "",
    name: "",
    phone: "",
    note: "",
    postCode: "",
    sex: Sex.MAN,
    url: "",
    registeredAt: new Date("2022-01-01T00:00:00Z"),
  },
  {
    customerId: "175c8968-010b-1d53-a51a-0583b990fe41",
    address: "東京都千代田区丸の内1-9-1",
    email: "example1@example.com",
    mobilePhone: "07000000000",
    phone: "0310000000",
    name: "佐藤 花子",
    note: "美容系のサロンのオーナーさん",
    postCode: "3000000",
    sex: Sex.WOMAN,
    url: "http://example.com/example0",
    registeredAt: new Date("2022-01-01T01:00:00Z"),
  },
  {
    customerId: "175c8968-010b-1d53-a51a-0583b990fe31",
    address: "京都市千代田区丸の内1-9-1",
    email: "example1@example.com",
    mobilePhone: "07000000001",
    phone: "0310000001",
    name: "岡田 羽成",
    note: "建設企業のIT部門リーダー",
    postCode: "3000001",
    sex: Sex.UNKNOWN,
    url: "http://example.com/example1",
    registeredAt: new Date("2022-01-01T00:00:00Z"),
  },
];

export function createCustomerFixtures() {
  return [...customerSources];
}