import { ChildDTO } from "baby-log-api";
import { HttpResponse, http } from "msw";

export const childrenHandlers = [
  http.get("/api/children", () =>
    HttpResponse.json<ChildDTO[]>([
      {
        birthDate: new Date(),
        familyName: "Babysson",
        gender: "female",
        givenName: "Baby",
        id: 1,
        name: "Baby Babysson",
      },
    ])
  ),
];
