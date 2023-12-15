import { ApiResponse } from "../types/Api";

export const redirect = (res: ApiResponse, Location: string) => {
  res.writeHead(302, {
    Location,
  });

  res.end();
};
