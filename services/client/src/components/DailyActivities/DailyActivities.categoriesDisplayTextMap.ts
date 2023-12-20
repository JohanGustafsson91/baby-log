import { ActivityDTO } from "baby-log-api";

export const categoriesDisplayTextMap: Record<ActivityDTO["category"], string> =
  {
    "diaper-change": "Blöjbyte",
    "diaper-change-dirty": "Blöjbyte bajs",
    bath: "Bad",
    food: "Mat",
    hygiene: "Hygien",
    sleep: "Sov",
    other: "Annat",
    "health-check": "Temperatur",
  };
