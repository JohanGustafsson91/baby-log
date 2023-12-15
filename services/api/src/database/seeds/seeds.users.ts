import { createUser } from "../../services/services.user";

export const seedUsers = async () => {
  console.log("seed users");
  return createUser({
    email: "johan.gustafsson91@gmail.com",
    family_name: "",
    given_name: "",
    name: "Johan",
    picture: "",
  });
};
