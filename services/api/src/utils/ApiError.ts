import { errorCode } from "./errorCodes";

export class ApiError extends Error {
  code: keyof typeof errorCode;
  status: number;

  constructor({
    message,
    code,
    status,
  }: {
    message?: string;
    code: keyof typeof errorCode;
    status: number;
  }) {
    super(message ?? code);

    Object.setPrototypeOf(this, ApiError.prototype);

    this.code = code;
    this.status = status;
  }
}
