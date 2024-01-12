import { getElapsedTime, isSameDate } from "@/shared/dateUtils";
import { ActivityDTO } from "baby-log-api";

export const useNotifications = (sortedActivities: ActivityDTO[]) => {
  const showNotifications = !(
    new Date().getHours() >= NIGHT_SLEEP_START_TIME &&
    sortedActivities[0]?.category === "sleep"
  );

  const notificationsForActivities = showNotifications
    ? Object.values(
        sortedActivities
          .filter((a) => isSameDate(a.startTime, new Date()))
          .reduceRight((acc, curr) => {
            const category = curr.category.replace("-dirty", "");
            return {
              ...acc,
              [category]: { ...curr, category },
            };
          }, {} as Record<ActivityDTO["category"], ActivityDTO>)
      ).map((latestActivity) => {
        return {
          id: latestActivity.id,
          category: latestActivity.category,
          notification: getNotification(latestActivity),
        };
      })
    : [];

  return notificationsForActivities;
};

const notificationSettings: Record<
  ActivityDTO["category"],
  { info: NotificationData; warning: NotificationData } | undefined
> = {
  sleep: {
    info: { hours: 3, minutes: 0, message: { title: "", body: "" } },
    warning: { hours: 4, minutes: 0, message: { title: "", body: "" } },
  },
  food: {
    info: { hours: 2, minutes: 0, message: { title: "", body: "" } },
    warning: { hours: 3, minutes: 0, message: { title: "", body: "" } },
  },
  "diaper-change": {
    info: { hours: 2, minutes: 30, message: { title: "", body: "" } },
    warning: { hours: 4, minutes: 0, message: { title: "", body: "" } },
  },
  "diaper-change-dirty": undefined,
  "health-check": undefined,
  bath: undefined,
  hygiene: undefined,
  other: undefined,
};

const NIGHT_SLEEP_START_TIME = 19;

type NotificationData = {
  hours: number;
  minutes: number;
  message: { title: string; body: string };
};

export type Notification =
  | {
      type: "none";
      message: undefined;
    }
  | { type: "info"; message: NotificationData["message"] }
  | { type: "warning"; message: NotificationData["message"] };

const getNotification = (activity: ActivityDTO): Notification => {
  const rules = notificationSettings[activity.category];

  if (!rules) {
    return {
      type: "none",
      message: undefined,
    };
  }

  const { elapsedHours, elapsedMinutes } = getElapsedTime(
    activity.endTime ?? activity.startTime
  );

  return [
    isBeyondThreshold({
      elapsedHours,
      elapsedMinutes,
      rules: rules.warning,
    }) && { type: "warning", message: rules.warning.message },
    isBeyondThreshold({
      elapsedHours,
      elapsedMinutes,
      rules: rules.info,
    }) && { type: "info", message: rules.info.message },
    {
      type: "none",
      message: undefined,
    },
  ].find(Boolean) as Notification;
};

const isBeyondThreshold = ({
  elapsedHours,
  elapsedMinutes,
  rules,
}: {
  elapsedHours: number;
  elapsedMinutes: number;
  rules: NotificationData;
}) => elapsedHours + 1 > rules.hours && elapsedMinutes > rules.minutes;
