import { UserDTO } from "./models.user";
import { queryDatabase } from "../database/connection";
import { ChildDTO } from "./models.child";

export const ActivityModel = {
  insertActivity: async ({
    childId,
    userId,
    activity,
  }: {
    childId: ChildDTO["id"];
    userId: UserDTO["id"];
    activity: Omit<ActivityDTO, "id">;
  }): Promise<number> => {
    const query = `
          INSERT INTO activities 
            (user_id, child_id, start_time, end_time, category, details) 
          VALUES 
            (?, ?, ?, ?, ?, ?);
        `;

    const insertActivity = await queryDatabase(query, [
      userId,
      childId,
      activity.startTime,
      activity.endTime,
      activity.category,
      activity.details,
    ]);

    return insertActivity.insertId;
  },
  getActivitiesBetweenDates: async ({
    userId,
    childId,
    startDate,
    endDate,
  }: {
    childId: ChildDTO["id"];
    userId: UserDTO["id"];
    startDate: Date;
    endDate: Date;
  }): Promise<ActivityDTO[]> => {
    const query = `
      SELECT *
      FROM activities
      WHERE child_id = ?
      AND DATE(start_time) >= ?
      AND DATE(start_time) <= ?
      ORDER BY start_time DESC
    `;

    const rows = await queryDatabase<DatabaseActivity[]>(query, [
      childId,
      userId,
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0],
    ]);

    return rows ? rows.map(toActivity) : rows;
  },
  getActivityByIdAndUserId: async ({
    userId,
    activityId,
    childId,
  }: {
    userId: UserDTO["id"];
    activityId: ActivityDTO["id"];
    childId: ChildDTO["id"];
  }) => {
    const query = `
      SELECT *
      FROM activities
      WHERE activity_id = ?
      AND child_id = ?
    `;

    const [rows] = await queryDatabase<DatabaseActivity[]>(query, [
      activityId,
      userId,
      childId,
    ]);

    return rows ? toActivity(rows) : rows;
  },
  updateActivity: async (activity: ActivityDTO) => {
    const query = `
          UPDATE activities
          SET start_time = ?,
              end_time = ?,
              category = ?,
              details = ?
          WHERE activity_id = ?;
        `;

    const result = await queryDatabase(query, [
      activity.startTime,
      activity.endTime ?? null,
      activity.category,
      activity.details ?? null,
      activity.id,
    ]);

    return result.affectedRows === 1;
  },
  deleteActivity: async ({
    userId,
    activityId,
    childId,
  }: {
    userId: UserDTO["id"];
    activityId: ActivityDTO["id"];
    childId: ChildDTO["id"];
  }) => {
    const query = `
        DELETE FROM activities
        WHERE activity_id = ? AND child_id = ?;
    `;

    const result = await queryDatabase(query, [activityId, userId, childId]);

    return result.affectedRows === 1;
  },
  getLatestActivityDetails: async ({
    userId,
    childId,
  }: {
    userId: UserDTO["id"];
    childId: ChildDTO["id"];
  }): Promise<ActivityLatestDetailsDTO> => {
    const query = `
      SELECT category, GROUP_CONCAT(DISTINCT TRIM(details)) AS details, MAX(start_time) AS latest_start_time
      FROM (
        SELECT category, details, start_time, ROW_NUMBER() OVER (PARTITION BY category ORDER BY start_time DESC) AS row_num
        FROM activities
        WHERE details IS NOT NULL AND child_id = ? AND start_time >= CURRENT_DATE - INTERVAL 7 DAY
      ) AS ranked_activities
      GROUP BY category
      ORDER BY latest_start_time DESC;
  `;

    const rows = await queryDatabase<DatabaseLatestDetails[]>(query, [
      userId,
      childId,
    ]);

    return rows
      ? rows.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.category]: curr.details
              .split(",")
              .map((string) => string.trim())
              .filter(Boolean),
          };
        }, {} as ActivityLatestDetailsDTO)
      : rows;
  },
};

const toActivity = (activity: DatabaseActivity): ActivityDTO => ({
  id: activity.activity_id,
  category: activity.category,
  startTime: activity.start_time,
  details: activity.details ?? "",
  endTime: activity.end_time ?? undefined,
});

type ActivityCategory =
  | "food"
  | "sleep"
  | "hygiene"
  | "health-check"
  | "diaper-change"
  | "diaper-change-dirty"
  | "bath"
  | "other";

export interface ActivityDTO {
  startTime: Date;
  endTime?: Date | null;
  category: ActivityCategory;
  details?: string;
  id: number;
}

export type ActivityLatestDetailsDTO = Record<
  ActivityCategory,
  string[] | undefined
>;

interface DatabaseActivity {
  activity_id: number;
  user_id: number;
  child_id: number;
  start_time: Date;
  end_time: Date | null;
  category: ActivityDTO["category"];
  details: string | null;
  created_at: Date;
}

interface DatabaseLatestDetails {
  category: ActivityCategory;
  details: string;
  latest_start_time: Date;
}
