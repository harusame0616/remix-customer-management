import { DealPlatformLabel, DealStatusLabel } from "./constants";

export type DealStatus = (typeof DealStatusLabel)[keyof typeof DealStatusLabel];
export type DealPlatform =
  (typeof DealPlatformLabel)[keyof typeof DealPlatformLabel];
