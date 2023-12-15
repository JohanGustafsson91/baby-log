import { UserDTO } from "../models/models.user";
import { UserModel } from "../models/models.user";

export const getUserByEmail = async ({
  email,
}: {
  email: string;
}): Promise<UserDTO | undefined> => {
  const user = await UserModel.getUserByEmail({ email });
  return user;
};

export const createUser = async (user: {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}): Promise<UserDTO["id"]> => {
  return UserModel.insertUser(user);
};
