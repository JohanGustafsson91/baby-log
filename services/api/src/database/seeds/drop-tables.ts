import { connectToDatabase } from "../connection";

export async function dropTables() {
  const connection = await connectToDatabase();
  try {
    console.log("drop table users");
    await connection.execute("DROP TABLE IF EXISTS users;");
    console.log("drop table children");
    await connection.execute("DROP TABLE IF EXISTS children;");
    console.log("drop table users_children");
    await connection.execute("DROP TABLE IF EXISTS users_children;");
    console.log("drop table activities");
    await connection.execute("DROP TABLE IF EXISTS activities;");
  } catch (error) {
    console.log({ error });
  } finally {
    connection.end();
  }
}
