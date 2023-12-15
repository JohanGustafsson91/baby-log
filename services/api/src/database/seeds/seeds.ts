import { connectToDatabase } from "../connection";
import { ChildModel } from "../../models/models.child";
import { createTables } from "./create-tables";
import { dropTables } from "./drop-tables";
import { seedActivities } from "./seeds.activities";
import { seedChildren } from "./seeds.children";
import { seedUsers } from "./seeds.users";
import { getActivitiesBetweenDates } from "../../services/services.activity";

async function seedDatabase() {
  await dropTables();
  await createTables();

  const connection = await connectToDatabase();
  try {
    const insertedUserId = await seedUsers();
    const childrenIds = await seedChildren({ userId: insertedUserId });
    await seedActivities({ userId: insertedUserId, childId: childrenIds[0] });

    const childrenForUser = await ChildModel.getChildrenByUserId({
      userId: insertedUserId,
    });
    console.log("users children:");
    console.log(JSON.stringify(childrenForUser, null, 2));

    const activitiesForChild = await getActivitiesBetweenDates({
      userId: insertedUserId,
      childId: childrenIds[0],
      startDate: new Date(),
      endDate: new Date(),
    });
    console.log("activities for child:");
    console.log(JSON.stringify(activitiesForChild, null, 2));
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
}

seedDatabase();
