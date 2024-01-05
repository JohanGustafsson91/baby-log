import { UserDTO } from "baby-log-api";
import { HttpResponse, http } from "msw";

export const userHandlers = [
  http.get("/api/user", () =>
    HttpResponse.json<UserDTO>({
      id: 1,
      createdAt: new Date(),
      familyName: "Doe",
      givenName: "John",
      pictureUrl: "",
      email: "john.doe@gmail.com",
      name: "John Doe",
    })
  ),
  http.delete("/api/login", () => HttpResponse.json<boolean>(true)),
];
