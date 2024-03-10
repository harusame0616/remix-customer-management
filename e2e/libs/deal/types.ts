import { DealStatusLabel } from "./constants";

export type Status = (typeof DealStatusLabel)[keyof typeof DealStatusLabel];
