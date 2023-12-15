import { UserDTO } from "../models/models.user";
import { IncomingMessage, ServerResponse } from "http";

export interface ApiRequest<T = undefined> extends IncomingMessage {
  query: Partial<{
    [key: string]: string | string[];
  }>;
  cookies: Partial<{
    [key: string]: string;
  }>;
  body: unknown;
  user: T extends undefined ? never : UserDTO;
}

type Send<T> = (body: T) => void;

export type ApiResponse<Data = unknown> = ServerResponse & {
  send: Send<Data>;
  json: Send<Data>;
  status: (statusCode: number) => ApiResponse<Data>;
};
