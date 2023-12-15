import { ApiRequest, ApiResponse } from "../types/Api";
import { ApiError } from "../utils/ApiError";
import { handleError } from "./handleError";

export const routeMiddleware = (methodsMap: Routes) => {
  return async (req: ApiRequest, res: ApiResponse, next?: () => void) => {
    try {
      const method = req.method?.toUpperCase() ?? "";
      const handler = methodsMap[method];

      if (handler) {
        await handler(req, res);
      } else {
        throw new ApiError({ status: 405, code: "method_not_allowed" });
      }
    } catch (error) {
      return handleError({ res, error });
    }

    next?.();
  };
};

type Routes = {
  [method: string]: (req: ApiRequest, res: ApiResponse) => Promise<void>;
};
