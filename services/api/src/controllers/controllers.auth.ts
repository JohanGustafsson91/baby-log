import { config } from "../config";
import { signToken, verifyJwt } from "../utils/jwt";
import * as userService from "../services/services.user";
import { deleteCookie, getCookie, setCookie } from "../utils/cookie";
import { redirect } from "../utils/redirect";
import { ApiError } from "../utils/ApiError";
import { getFormattedHostUrl } from "../utils/getHostUrl";
import { ApiRequest, ApiResponse } from "../types/Api";
import { handleError } from "../middleware/handleError";

export const initAuthentication = async (req: ApiRequest, res: ApiResponse) => {
  try {
    const state = Math.random().toString(36).substring(7);

    setCookie(config.oauth.csrfStateTokenName, state, {
      maxAge: 1000 * 60 * 5,
      httpOnly: true,
      req,
      res,
    });

    return redirect(
      res,
      `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: config.oauth.google.clientId,
        redirect_uri: config.oauth.google.redirectUri,
        response_type: "code",
        include_granted_scopes: "true",
        access_type: "offline",
        scope: "email profile",
        state,
      })}`
    );
  } catch (error) {
    return handleError({
      res,
      error,
      redirectUrl: `${getFormattedHostUrl(req.headers.host)}/login`,
    });
  }
};

export const authenticateUser = async (req: ApiRequest, res: ApiResponse) => {
  try {
    const { error, state, code } = req.query;
    const csrfState = getCookie(config.oauth.csrfStateTokenName, { req, res });

    if (error || !code) {
      throw new ApiError({ status: 401, code: "unathorized" });
    }

    const invalidCsrfState = [!state, !csrfState, state !== csrfState].some(
      Boolean
    );

    if (invalidCsrfState) {
      throw new ApiError({ status: 401, code: "state" });
    }

    const tokenResponse = await fetch(
      `https://oauth2.googleapis.com/token?${new URLSearchParams({
        client_id: config.oauth.google.clientId,
        client_secret: config.oauth.google.clientSecret,
        redirect_uri: config.oauth.google.redirectUri,
        code: [code].join(""),
        grant_type: "authorization_code",
      })}`,
      {
        method: "POST",
      }
    );

    if (!tokenResponse.ok) {
      throw new ApiError({ status: 401, code: "unathorized" });
    }

    const { access_token } = await tokenResponse.json();

    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      throw new ApiError({ status: 401, code: "user_not_found" });
    }

    const userInfo = await userInfoResponse.json();

    const existingUser = await userService.getUserByEmail({
      email: userInfo.email,
    });

    if (!existingUser) {
      await userService.createUser(userInfo);
    }

    const user =
      existingUser ||
      (await userService.getUserByEmail({ email: userInfo.email }));

    if (!user) {
      throw new ApiError({ status: 401, code: "user_not_found" });
    }

    const { accessToken, refreshToken } = await signToken({
      sub: user.id.toString(),
      username: user.email,
      iat: new Date().getTime(),
      iss: `${process.env.APP_BASE_URL}`,
      aud: "client",
      custom_claim: "",
    });

    setCookie(config.cookies.accessToken, accessToken, {
      expires: new Date(
        Date.now() + config.accessTokenExpiresInMinutes * 60 * 1000
      ),
      maxAge: config.accessTokenExpiresInMinutes * 60,
      httpOnly: true,
      sameSite: "lax",
      req,
      res,
    });

    setCookie(config.cookies.refreshToken, refreshToken, {
      expires: new Date(
        Date.now() + config.refreshTokenExpiresInMinutes * 60 * 1000
      ),
      maxAge: config.refreshTokenExpiresInMinutes * 60,
      httpOnly: true,
      sameSite: "lax",
      req,
      res,
    });

    deleteCookie(config.oauth.csrfStateTokenName, { res, req });

    return redirect(res, `${getFormattedHostUrl(req.headers.host)}`);
  } catch (error) {
    return handleError({
      res,
      error,
      redirectUrl: `${getFormattedHostUrl(req.headers.host)}/login`,
    });
  }
};

export const refreshAccessToken = async (req: ApiRequest, res: ApiResponse) => {
  try {
    const token = getCookie(config.cookies.refreshToken, {
      req,
      res,
    }) as string;
    const decoded = verifyJwt<{ username: string }>(
      token,
      "refreshTokenPublicKey"
    );

    if (!decoded) {
      throw new ApiError({ status: 403, code: "unathorized" });
    }

    const user = await userService.getUserByEmail({ email: decoded.username });

    if (!user) {
      throw new ApiError({ status: 403, code: "unathorized" });
    }

    const { accessToken, refreshToken } = await signToken({
      sub: user.id.toString(),
      username: user.email,
      iat: new Date().getTime(),
      iss: `${process.env.APP_BASE_URL}`,
      aud: "client",
      custom_claim: "",
    });

    setCookie(config.cookies.accessToken, accessToken, {
      expires: new Date(
        Date.now() + config.accessTokenExpiresInMinutes * 60 * 1000
      ),
      maxAge: config.accessTokenExpiresInMinutes * 60,
      httpOnly: true,
      sameSite: "lax",
      req,
      res,
    });

    setCookie(config.cookies.refreshToken, refreshToken, {
      expires: new Date(
        Date.now() + config.refreshTokenExpiresInMinutes * 60 * 1000
      ),
      maxAge: config.refreshTokenExpiresInMinutes * 60,
      httpOnly: true,
      sameSite: "lax",
      req,
      res,
    });

    return res.status(200).json({
      message: "authorized",
    });
  } catch (error) {
    return handleError({
      res,
      error,
    });
  }
};

export const logout = async (req: ApiRequest, res: ApiResponse) => {
  try {
    Object.values(config.cookies).forEach((cookieName) =>
      deleteCookie(cookieName, { path: "/", req, res })
    );

    return res.status(200).json({ message: "logged_out" });
  } catch (error) {
    return handleError({ res, error });
  }
};
