import { UserDTO } from "../../models/models.user";
import { ChildDTO } from "../../models/models.child";
import { ActivityDTO } from "../../models/models.activity";
import { createActivityForChild } from "../../services/services.activity";

export const seedActivities = async ({
  userId,
  childId,
}: {
  userId: UserDTO["id"];
  childId: ChildDTO["id"];
}) => {
  console.log("seed activities");
  const ids = [];

  for (const activity of activities) {
    const id = await createActivityForChild({ childId, userId, activity });
    ids.push(id);
  }

  return ids;
};

const activities: Omit<ActivityDTO, "id">[] = [
  {
    startTime: parseTimeString("08:00"),
    category: "food",
    details: "Välling 1.5dl",
  },
  {
    startTime: parseTimeString("09:11"),
    category: "diaper-change",
    details: "",
  },
  {
    startTime: parseTimeString("10:05"),
    endTime: parseTimeString("10:35"),
    category: "sleep",
  },
  {
    startTime: parseTimeString("10:45"),
    category: "food",
    details: "Gröt en portion",
  },
  {
    startTime: parseTimeString("11:00"),
    category: "diaper-change",
    details: "Bajs",
  },
  {
    startTime: parseTimeString("13:25"),
    category: "diaper-change",
    details: "",
  },
  {
    startTime: parseTimeString("13:25"),
    category: "health-check",
    details: "Temperatur 37.3 grader",
  },
  {
    startTime: parseTimeString("13:30"),
    category: "food",
    details: "Välling 2dl",
  },
  {
    startTime: parseTimeString("14:30"),
    endTime: parseTimeString("15:00"),
    category: "sleep",
  },
  {
    startTime: parseTimeString("15:30"),
    category: "food",
    details: "Pastasås en halv burk",
  },
  {
    startTime: parseTimeString("16:00"),
    category: "other",
    details: "D-vitamin",
  },
  {
    startTime: parseTimeString("16:45"),
    category: "diaper-change",
    details: "",
  },
  {
    startTime: parseTimeString("16:54"),
    category: "health-check",
    details: "Feber 37.5 grader",
  },
  {
    startTime: parseTimeString("17:15"),
    category: "food",
    details: "Banan",
  },
  {
    startTime: parseTimeString("18:30"),
    category: "diaper-change",
    details: "",
  },
  {
    startTime: parseTimeString("19:00"),
    category: "hygiene",
    details: "Smörja in med salva",
  },
];

function parseTimeString(timeString: string, date = new Date()) {
  const [hours, minutes] = timeString.split(":").map(Number);

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error("Invalid time format");
  }

  const currentDate = new Date(date);
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  return currentDate;
}
