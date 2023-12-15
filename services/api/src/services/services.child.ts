import { ChildModel } from "../models/models.child";
import { ChildDTO } from "../models/models.child";
import { UserDTO } from "../models/models.user";

export async function getChildrenByUserId({
  userId,
}: {
  userId: UserDTO["id"];
}): Promise<ChildDTO[]> {
  const children = await ChildModel.getChildrenByUserId({ userId });
  return children;
}
