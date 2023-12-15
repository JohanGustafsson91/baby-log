import { SignOptions, sign, verify } from "jsonwebtoken";
import { config } from "../config";

export function signJwt(
  payload: unknown,
  key: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions = {}
) {
  const privateKey = Buffer.from(config[key], "base64").toString("ascii");

  return sign(payload as object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(
  token: string,
  key: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null {
  try {
    const publicKey = Buffer.from(config[key], "base64").toString("ascii");
    return verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
}

export async function signToken(data: {
  sub: string;
  username: string;
  iat: number;
  iss: string;
  aud: string;
  custom_claim: string;
}) {
  const accessToken = signJwt(data, "accessTokenPrivateKey", {
    expiresIn: `${config.accessTokenExpiresInMinutes}m`,
  });

  const refreshToken = signJwt(data, "refreshTokenPrivateKey", {
    expiresIn: `${config.refreshTokenExpiresInMinutes}m`,
  });

  return { accessToken, refreshToken };
}
