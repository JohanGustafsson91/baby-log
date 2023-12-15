import { getUser } from "../controllers/controllers.user";
import { routeMiddleware } from "../middleware/middleware.route";
import { authMiddleware } from "../middleware/middleware.auth";

export const userRoutes = {
  "/api/user": routeMiddleware({
    GET: authMiddleware(getUser),
  }),
};
