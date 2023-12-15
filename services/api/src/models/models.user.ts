import { queryDatabase } from "../database/connection";

export const UserModel = {
  getUserByEmail: async ({
    email,
  }: {
    email: string;
  }): Promise<UserDTO | undefined> => {
    const query = `
          SELECT *
          FROM users
          WHERE email = ?
        `;

    const [rows] = await queryDatabase<DatabaseUser[]>(query, [email]);

    return rows ? toUser(rows) : rows;
  },
  insertUser: async (user: {
    email: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
  }) => {
    const query = `
      INSERT INTO users
        (email, name, given_name, family_name, picture_url)
      VALUES
        (?, ?, ?, ?, ?)
    `;

    const result = await queryDatabase(query, [
      user.email,
      user.name,
      user.given_name,
      user.family_name,
      user.picture,
    ]);

    return result.insertId;
  },
};

const toUser = (user: DatabaseUser): UserDTO => ({
  id: user.user_id,
  email: user.email,
  createdAt: user.created_at,
  familyName: user.family_name,
  givenName: user.given_name,
  name: user.name,
  pictureUrl: user.picture_url,
});

export interface UserDTO {
  id: number;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  pictureUrl: string;
  createdAt: Date;
}

interface DatabaseUser {
  user_id: number;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture_url: string;
  created_at: Date;
}
