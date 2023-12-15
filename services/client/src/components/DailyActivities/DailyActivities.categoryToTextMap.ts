import { ActivityDTO } from "baby-log-api";

export const categoryToTextMap: Record<ActivityDTO["category"], string> = {
  "diaper-change": "Blöjbyte",
  bath: "Bad",
  food: "Mat",
  hygiene: "Hygien",
  sleep: "Sov",
  other: "Annat",
  "health-check": "Temperatur",
};
