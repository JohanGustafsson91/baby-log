import { handleError } from "../middleware/handleError";
import { UserDTO } from "../models/models.user";
import { ApiRequest, ApiResponse } from "../types/Api";

export const getUser = async (
  req: ApiRequest<true>,
  res: ApiResponse<UserDTO>
) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return handleError({ res, error });
  }
};
