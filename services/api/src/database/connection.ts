import { config } from "../config";
import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export const connectToDatabase = () =>
  mysql.createConnection(config.databaseUrl);

// TODO re-use connection

export const queryDatabase = async <T = undefined>(
  sql: string,
  values: unknown[]
) => {
  const connection = await connectToDatabase();
  try {
    const [result] = await connection.query<DbReturnType<T>>(sql, values);
    return result as ReturnType<T>;
  } finally {
    //connection.end();
  }
};

type DbReturnType<T> = T extends undefined
  ? ResultSetHeader
  : Array<T & RowDataPacket>;

type ReturnType<T> = T extends undefined ? ResultSetHeader : T;
