import { getCookie } from "../utils/cookie";
import { getUserByEmail } from "../services/services.user";
import { config } from "../config";
import { verifyJwt } from "../utils/jwt";
import { errorCode } from "../utils/errorCodes";
import { ApiRequest, ApiResponse } from "../types/Api";
import { handleError } from "./handleError";

export const authMiddleware = (handler: Handler) => {
  return async (req: ApiRequest, res: ApiResponse) => {
    try {
      const accessToken = getCookie(config.cookies.accessToken, { req, res });

      if (!accessToken) {
        return res.status(401).json({ message: errorCode.unathorized });
      }

      const verifiedToken = verifyJwt<{ username: string }>(
        accessToken ?? "",
        "accessTokenPublicKey"
      );

      if (!verifiedToken) {
        return res.status(401).json({ message: errorCode.unathorized });
      }

      const user = await getUserByEmail({ email: verifiedToken.username });

      if (!user) {
        return res.status(401).json({ message: errorCode.unathorized });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).user = user;

      return handler(req as unknown as ApiRequest<true>, res);
    } catch (error) {
      return handleError({ res, error });
    }
  };
};

type Handler = (req: ApiRequest<true>, res: ApiResponse) => Promise<void>;
