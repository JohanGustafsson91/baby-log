import { getChildren } from "../controllers/controllers.child";
import { authMiddleware } from "../middleware/middleware.auth";
import { routeMiddleware } from "../middleware/middleware.route";

export const childrenRoutes = {
  "/api/children": routeMiddleware({
    GET: authMiddleware(getChildren),
  }),
};
