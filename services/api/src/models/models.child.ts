import { UserDTO } from "./models.user";
import { queryDatabase } from "../database/connection";

export const ChildModel = {
  getChildrenByUserId: async ({
    userId,
  }: {
    userId: UserDTO["id"];
  }): Promise<ChildDTO[]> => {
    const rows = await queryDatabase<DatabaseChild[]>(
      `SELECT c.*
           FROM users u
           JOIN users_children uc ON u.user_id = uc.user_id
           JOIN children c ON uc.child_id = c.child_id
           WHERE u.user_id = ?`,
      [userId]
    );

    return rows ? rows.map(toChild) : [];
  },
  getChildById: async ({
    userId,
    childId,
  }: {
    userId: UserDTO["id"];
    childId: ChildDTO["id"];
  }): Promise<ChildDTO | undefined> => {
    const [rows] = await queryDatabase<DatabaseChild[]>(
      `SELECT c.*
      FROM children c
      JOIN users_children uc ON c.child_id = uc.child_id
      WHERE c.child_id = ? AND uc.user_id = ?`,
      [childId, userId]
    );

    return rows ? toChild(rows) : undefined;
  },
  insertChild: async ({
    child,
    userId,
  }: {
    child: ChildDTO;
    userId: UserDTO["id"];
  }) => {
    const insertChild = await queryDatabase(
      "INSERT INTO children (name, given_name, family_name, birthdate, gender) VALUES (?, ?, ?, ?, ?)",
      [
        child.name,
        child.givenName,
        child.familyName,
        child.birthDate,
        child.gender,
      ]
    );

    await queryDatabase(
      "INSERT INTO users_children (user_id, child_id) VALUES (?, ?)",
      [userId, insertChild.insertId]
    );

    return insertChild.insertId;
  },
};

const toChild = (child: DatabaseChild): ChildDTO => ({
  id: child.child_id,
  birthDate: child.birthdate,
  familyName: child.family_name,
  gender: child.gender,
  givenName: child.given_name,
  name: child.name,
});

export interface ChildDTO {
  id: number;
  name: string;
  givenName: string;
  familyName: string;
  birthDate: Date;
  gender: "male" | "female";
}

interface DatabaseChild {
  child_id: number;
  name: string;
  given_name: string;
  family_name: string;
  birthdate: Date;
  gender: "male" | "female";
  created_at: Date;
}
