export const errorCode = {
  state: "state",
  unathorized: "unathorized",
  user_not_found: "user_not_found",
  unhandled_error: "internal_server_error",
  method_not_allowed: "method_not_allowed",
  forbidden: "forbidden",
  bad_request: "bad_request",
};

export const getCodeFromError = (obj: unknown) => {
  return obj instanceof Error
    ? errorCode[obj.message as keyof typeof errorCode] ??
        errorCode.unhandled_error
    : errorCode.unhandled_error;
};
