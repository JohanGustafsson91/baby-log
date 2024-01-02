import { ChildDTO } from "../models/models.child";
import { UserDTO } from "../models/models.user";
import { ChildModel } from "../models/models.child";
import { ApiError } from "../utils/ApiError";
import { ActivityModel, ActivityDTO } from "../models/models.activity";

export const getActivitiesBetweenDates = async ({
  userId,
  childId,
  startDate,
  endDate,
}: {
  userId: UserDTO["id"];
  childId: ChildDTO["id"];
  startDate: ActivityDTO["startTime"];
  endDate: ActivityDTO["startTime"];
}): Promise<ActivityDTO[]> => {
  const child = await getChildById({
    userId,
    childId,
  });

  const activities = await ActivityModel.getActivitiesBetweenDates({
    childId: child.id,
    userId,
    startDate,
    endDate,
  });

  return activities;
};

export const createActivityForChild = async ({
  userId,
  childId,
  activity,
}: {
  userId: UserDTO["id"];
  childId: ChildDTO["id"];
  activity: Omit<ActivityDTO, "id">;
}): Promise<ActivityDTO> => {
  const child = await getChildById({
    userId,
    childId,
  });

  const createdActivityId = await ActivityModel.insertActivity({
    childId: child.id,
    userId,
    activity,
  });

  return {
    id: createdActivityId,
    ...activity,
  };
};

export const updateActivityForChild = async ({
  userId,
  childId,
  activityId,
  activity,
}: {
  userId: UserDTO["id"];
  childId: ChildDTO["id"];
  activityId: ActivityDTO["id"];
  activity: Omit<Partial<ActivityDTO>, "id">;
}): Promise<ActivityDTO> => {
  const child = await getChildById({
    userId,
    childId,
  });

  const existingActivity = await ActivityModel.getActivityByIdAndUserId({
    activityId,
    userId,
    childId: child.id,
  });

  const updatedActivity = {
    id: existingActivity.id,
    category: activity.category || existingActivity.category,
    startTime: activity.startTime || existingActivity.startTime,
    endTime:
      activity.endTime || activity.endTime === null
        ? activity.endTime
        : existingActivity.endTime,
    details: activity.details ?? existingActivity.details ?? undefined,
  };

  const result = await ActivityModel.updateActivity(updatedActivity);

  if (!result) {
    throw new ApiError({ status: 400, code: "bad_request" });
  }

  return updatedActivity;
};

export const deleteActivityForChild = async ({
  userId,
  childId,
  activityId,
}: {
  userId: UserDTO["id"];
  childId: ChildDTO["id"];
  activityId: ActivityDTO["id"];
}): Promise<boolean> => {
  const child = await getChildById({
    userId,
    childId,
  });

  const result = await ActivityModel.deleteActivity({
    activityId,
    childId: child.id,
    userId,
  });

  return result;
};

export const getLatestActivityDetails = async ({
  userId,
  childId,
}: {
  userId: UserDTO["id"];
  childId: ChildDTO["id"];
}): Promise<unknown> => {
  const child = await getChildById({
    userId,
    childId,
  });

  const activities = await ActivityModel.getLatestActivityDetails({
    childId: child.id,
    userId,
  });

  return activities;
};

const getChildById = async ({
  userId,
  childId,
}: {
  userId: UserDTO["id"];
  childId: ChildDTO["id"];
}) => {
  const child = await ChildModel.getChildById({ userId, childId });
  if (!child) {
    throw new ApiError({ status: 403, code: "forbidden" });
  }
  return child;
};
