import {
  createActivity,
  deleteActivity,
  getActivities,
  getActivityDetails,
  updateActivity,
} from "../controllers/controllers.activity";
import { authMiddleware } from "../middleware/middleware.auth";
import { routeMiddleware } from "../middleware/middleware.route";

export const activityRoutes = {
  "/api/activities/[childId]": routeMiddleware({
    POST: authMiddleware(createActivity),
  }),
  "/api/activities/[childId]/[activityId]": routeMiddleware({
    PATCH: authMiddleware(updateActivity),
    DELETE: authMiddleware(deleteActivity),
  }),
  "/api/activities/[childId]/between/[...startAndEndTime]": routeMiddleware({
    GET: authMiddleware(getActivities),
  }),
  "/api/activities/[childId]/latest-details": routeMiddleware({
    GET: authMiddleware(getActivityDetails),
  }),
};
