import { childrenHandlers } from "./childrenHandlers";
import { userHandlers } from "./userHandlers";
import { activitiesHandlers } from "./activitiesHandlers";

export const handlers = [
  ...userHandlers,
  ...childrenHandlers,
  ...activitiesHandlers,
];
