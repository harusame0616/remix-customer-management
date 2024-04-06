import { Sex } from "../domains/customer/models/customer";
import { Sex as PrismaSex } from "@prisma/client";

export function sexToLabel(sex: Sex) {
  return {
    [Sex.Man]: "男性",
    [Sex.Woman]: "女性",
    [Sex.Other]: "その他",
    [Sex.Unknown]: "不明",
  }[sex];
}

export function toDomainSex(sex: PrismaSex) {
  return {
    [PrismaSex.MAN]: Sex.Man,
    [PrismaSex.WOMAN]: Sex.Woman,
    [PrismaSex.UNKNOWN]: Sex.Unknown,
    [PrismaSex.OTHER]: Sex.Other,
  }[sex];
}
