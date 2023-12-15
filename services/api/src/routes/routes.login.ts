import {
  authenticateUser,
  initAuthentication,
  logout,
  refreshAccessToken,
} from "../controllers/controllers.auth";
import { routeMiddleware } from "../middleware/middleware.route";

export const loginRoutes = {
  "/api/login": routeMiddleware({
    GET: initAuthentication,
    DELETE: logout,
  }),
  "/api/callback": routeMiddleware({
    GET: authenticateUser,
  }),
  "/api/refresh": routeMiddleware({
    POST: refreshAccessToken,
  }),
};
