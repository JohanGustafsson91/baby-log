import { errorCode } from "../utils/errorCodes";
import { redirect } from "../utils/redirect";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../types/Api";
import { logger } from "../utils/logger";

export const handleError = ({
  res,
  error,
  redirectUrl,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: ApiResponse<any>;
  error: unknown;
  redirectUrl?: string;
}) => {
  logger.error({ error });

  if (error instanceof ApiError) {
    const errorRedirectUrl = redirectUrl
      ? `${redirectUrl}?error=${error.code}`
      : "";

    return errorRedirectUrl
      ? redirect(res, errorRedirectUrl)
      : res.status(error.status).json({ code: error.code });
  }

  const defaultErrorRedirectUrl = redirectUrl
    ? `${redirectUrl}?error=${errorCode.unhandled_error}`
    : "";

  return defaultErrorRedirectUrl
    ? redirect(res, defaultErrorRedirectUrl)
    : res.status(500).json({ code: errorCode.unhandled_error });
};
