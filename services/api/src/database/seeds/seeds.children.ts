import { UserDTO } from "../../models/models.user";
import { ChildModel } from "../../models/models.child";

const children: Parameters<typeof ChildModel.insertChild>[0]["child"][] = [
  {
    birthDate: new Date("2023-02-10"),
    gender: "female",
    name: "Stella",
    familyName: "",
    givenName: "",
    id: 0,
  },
  {
    birthDate: new Date("2023-02-09"),
    gender: "male",
    name: "Tessie",
    familyName: "",
    givenName: "",
    id: 1,
  },
];

export const seedChildren = async ({ userId }: { userId: UserDTO["id"] }) => {
  console.log("seed children");
  const ids = [];

  for (const child of children) {
    const id = await ChildModel.insertChild({ child, userId });
    ids.push(id);
  }

  return ids;
};
