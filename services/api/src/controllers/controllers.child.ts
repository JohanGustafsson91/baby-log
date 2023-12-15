import * as childService from "../services/services.child";
import { handleError } from "../middleware/handleError";
import { ApiRequest, ApiResponse } from "../types/Api";
import { ChildDTO } from "../models/models.child";

export async function getChildren(
  req: ApiRequest<true>,
  res: ApiResponse<ChildDTO[]>
) {
  try {
    const children = await childService.getChildrenByUserId({
      userId: req.user.id,
    });
    return res.status(200).json(children);
  } catch (error) {
    return handleError({ res, error });
  }
}
