import { parseTimeString } from "@/shared/dateUtils";
import { ActivityDTO, ActivityLatestDetailsDTO } from "baby-log-api";
import { HttpResponse, http } from "msw";

export const activitiesHandlers = [
  http.get("/api/activities/:childId/between/:startDate/:endDate", () =>
    HttpResponse.json<ActivityDTO[]>([
      {
        category: "diaper-change",
        id: 1,
        startTime: parseTimeString("05:00"),
        details: "",
      },
      {
        category: "food",
        id: 2,
        startTime: parseTimeString("05:15"),
        details: "Välling 2dl",
      },
    ])
  ),
  http.get("/api/activities/:childId/latest-details", () =>
    HttpResponse.json<ActivityLatestDetailsDTO>({
      bath: [],
      "diaper-change": [],
      "diaper-change-dirty": [],
      "health-check": [],
      food: ["Välling 2dl", "Gröt"],
      hygiene: [],
      other: [],
      sleep: [],
    })
  ),
  http.patch("/api/activities/:childId/:activityId", () =>
    HttpResponse.json<boolean>(true)
  ),
  http.delete("/api/activities/:childId/:activityId", () =>
    HttpResponse.json<boolean>(true)
  ),
];
