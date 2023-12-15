import { connectToDatabase } from "../connection";

export async function createTables() {
  const connection = await connectToDatabase();
  try {
    console.log("create table users");
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
            user_id int NOT NULL AUTO_INCREMENT,
            email varchar(255),
            name varchar(255),
            given_name varchar(255),
            family_name varchar(255),
            picture_url varchar(255),
            created_at timestamp NULL DEFAULT current_timestamp(),
            PRIMARY KEY (user_id),
            UNIQUE KEY email (email)
            )
            `);

    console.log("create table children");
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS children (
        child_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        given_name varchar(255),
        family_name varchar(255),
        birthdate DATE NOT NULL,
        gender ENUM('male', 'female') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
      `);

    console.log("create table users_children");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users_children (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        child_id INT NOT NULL
      )
    `);

    console.log("create table activities");
    await connection.execute(`
     CREATE TABLE IF NOT EXISTS activities (
        activity_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        child_id INT NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        category VARCHAR(50) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
  } catch (error) {
    console.log({ error });
  } finally {
    connection.end();
  }
}
