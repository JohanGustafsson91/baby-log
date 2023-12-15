import { ActivityDTO } from "../models/models.activity";
import { handleError } from "../middleware/handleError";
import { ApiRequest, ApiResponse } from "../types/Api";
import { ApiError } from "../utils/ApiError";
import * as activityService from "../services/services.activity";
import { ensureArray } from "../utils/ensureArray";

export const getActivities = async (
  req: ApiRequest<true>,
  res: ApiResponse<ActivityDTO[]>
) => {
  try {
    const childIdAsString = ensureArray(req.query.childId).join("");
    const [startDate, endDate] = ensureArray(req.query.startAndEndTime);

    if (!childIdAsString || !startDate || !endDate) {
      throw new ApiError({
        status: 400,
        code: "bad_request",
        message: "Missing required parameters.",
      });
    }

    const childId = parseInt(childIdAsString);

    const activities = await activityService.getActivitiesBetweenDates({
      childId,
      userId: req.user.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return res.status(200).json(activities);
  } catch (error) {
    return handleError({ res, error });
  }
};

export const createActivity = async (
  req: ApiRequest<true>,
  res: ApiResponse<ActivityDTO>
) => {
  try {
    const childId = parseInt(ensureArray(req.query.childId)[0]);
    const { category, startTime, endTime, details } =
      (req.body as ActivityDTO) ?? {};

    // TODO better validation
    if (!childId || !startTime || !category) {
      throw new ApiError({
        status: 400,
        code: "bad_request",
        message: "Missing required parameters.",
      });
    }

    const createdActivity = await activityService.createActivityForChild({
      childId,
      userId: req.user.id,
      activity: {
        category,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : undefined,
        details,
      },
    });

    return res.status(200).json(createdActivity);
  } catch (error) {
    return handleError({ res, error });
  }
};

export const updateActivity = async (
  req: ApiRequest<true>,
  res: ApiResponse
) => {
  try {
    const childId = parseInt(ensureArray(req.query.childId)[0]);
    const activityId = parseInt(ensureArray(req.query.activityId)[0]);
    const { category, startTime, endTime, details } =
      (req.body as ActivityDTO) ?? {};

    const updatedActivity = await activityService.updateActivityForChild({
      userId: req.user.id,
      activityId,
      childId,
      activity: {
        category,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        details,
      },
    });

    return res.status(200).json(updatedActivity);
  } catch (error) {
    return handleError({ res, error });
  }
};

export const deleteActivity = async (
  req: ApiRequest<true>,
  res: ApiResponse
) => {
  try {
    const childId = parseInt(ensureArray(req.query.childId)[0]);
    const activityId = parseInt(ensureArray(req.query.activityId)[0]);

    const deletedActivity = await activityService.deleteActivityForChild({
      userId: req.user.id,
      activityId,
      childId,
    });

    return res.status(deletedActivity ? 200 : 400).json(deletedActivity);
  } catch (error) {
    return handleError({ res, error });
  }
};
