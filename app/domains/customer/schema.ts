import { z } from "zod";
import { Sex } from "./models/customer";

export const NAME_MAX_LENGTH = 24;
export function nameSchema() {
  return z.string().max(NAME_MAX_LENGTH);
}

export const NAME_KANA_MAX_LENGTH = 48;
export function nameKanaSchema() {
  return z.string().max(NAME_KANA_MAX_LENGTH);
}

export function sexSchema() {
  return z.nativeEnum(Sex);
}
export function birthdaySchema() {
  return z.union([
    z
      .string()
      .datetime({ offset: true })
      .transform((isoTimestamp) => new Date(isoTimestamp))
      .pipe(
        z
          .date()
          .max(new Date("9999-12-31T23:59:59+09:00"))
          .transform((d) => d.toISOString()),
      ),
    z
      .date()
      .max(new Date("9999-12-31T23:59:59+09:00"))
      .transform((d) => d.toISOString()),
  ]);
}

export const PHONE_MIN_LENGTH = 9;
export const PHONE_MAX_LENGTH = 11;
export function phoneSchema() {
  return z.preprocess(
    (value) => (typeof value === "string" ? value.replace(/-/g, "") : value),
    z.string().regex(/^\d+$/).min(PHONE_MIN_LENGTH).max(PHONE_MAX_LENGTH),
  );
}

export const MOBILE_PHONE_MIN_LENGTH = PHONE_MIN_LENGTH;
export const MOBILE_PHONE_MAX_LENGTH = PHONE_MAX_LENGTH;
export function mobilePhoneSchema() {
  return z.preprocess(
    (value) => (typeof value === "string" ? value.replace(/-/g, "") : value),
    z
      .string()
      .regex(/^\d+$/)
      .min(MOBILE_PHONE_MIN_LENGTH)
      .max(MOBILE_PHONE_MAX_LENGTH),
  );
}

export const ADDRESS_MAX_LENGTH = 255;
export function addressSchema() {
  return z.string().max(ADDRESS_MAX_LENGTH);
}

export const POST_CODE_LENGTH = 7;
export function postCodeSchema() {
  return z.preprocess(
    (v) => (typeof v === "string" ? v.replace(/-/g, "") : v),
    z.string().regex(/^\d+$/).length(POST_CODE_LENGTH),
  );
}

export const EMAIL_MAX_LENGTH = 255;
export function emailSchema() {
  return z.string().email().max(EMAIL_MAX_LENGTH);
}

export const URL_MAX_LENGTH = 1024;
export function urlSchema() {
  return z.string().url().max(URL_MAX_LENGTH);
}

export const NOTE_MAX_LENGTH = 4096;
export function noteSchema() {
  return z.string().max(NOTE_MAX_LENGTH);
}
