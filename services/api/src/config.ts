export const config = Object.freeze({
  oauth: {
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
      redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI ?? "",
    },
    csrfStateTokenName: process.env.CSRF_STATE_TOKEN_NAME ?? "",
  },
  backendApiUrl: "/api",
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY ?? "",
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY ?? "",
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY ?? "",
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY ?? "",
  accessTokenExpiresInMinutes: 15,
  refreshTokenExpiresInMinutes: 10080, // one week
  cookies: {
    accessToken: "ktat",
    refreshToken: "ktrt",
  },
  databaseUrl: process.env.DATABASE_URL ?? "",
});
