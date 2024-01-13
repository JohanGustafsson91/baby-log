import { isSameDate } from "@/shared/dateUtils";
import { ActivityDTO } from "baby-log-api";
import { useEffect, useMemo, useState } from "react";

export const useNotifications = (sortedActivities: ActivityDTO[]) => {
  const [displayed, setDisplayed] = useState<ActivityDTO["id"][]>([]);

  const showNotifications = !(
    new Date().getHours() >= NIGHT_SLEEP_START_TIME &&
    sortedActivities[0]?.category === "sleep"
  );

  const notificationsForActivities = useMemo(
    () =>
      showNotifications
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
        : [],
    [sortedActivities, showNotifications]
  );

  useEffect(() => {
    notificationsForActivities.forEach((notification) => {
      if (notification && !displayed.includes(notification.id)) {
        try {
          displayWebNotification(notification);
        } catch (error) {
          console.log(error);
        } finally {
          setDisplayed((prev) => [...prev, notification.id]);
        }
      }
    });
  }, [displayed, notificationsForActivities]);

  return notificationsForActivities;
};

const displayWebNotification = ({ notification }: ActivityWithNotification) => {
  const { message } = notification;

  if (!message) {
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(message.title, { body: message.body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(message.title, { body: message.body });
      }
    });
  }
};

const notificationSettings: Record<
  ActivityDTO["category"],
  { info: NotificationData; warning: NotificationData } | undefined
> = {
  sleep: {
    info: {
      hours: 2,
      minutes: 59,
      message: { title: "Sova", body: "Börjar bli trött" },
    },
    warning: {
      hours: 3,
      minutes: 59,
      message: { title: "Sova", body: "Är trött" },
    },
  },
  food: {
    info: {
      hours: 1,
      minutes: 59,
      message: { title: "Äta", body: "Börjar bli hungrig" },
    },
    warning: {
      hours: 2,
      minutes: 59,
      message: { title: "Äta", body: "Är hungrig" },
    },
  },
  "diaper-change": {
    info: {
      hours: 2,
      minutes: 29,
      message: { title: "Byta blöja", body: "Börjar bli smutsig" },
    },
    warning: {
      hours: 3,
      minutes: 59,
      message: { title: "Byta blöja", body: "Är smutsig" },
    },
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

interface ActivityWithNotification {
  id: number;
  category: ActivityDTO["category"];
  notification: Notification;
}

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

  const potentialNotification = [
    isElapsedTimeExceedingThreshold(activity.endTime || activity.startTime, {
      hours: rules.warning.hours,
      minutes: rules.warning.minutes,
    }) && { type: "warning", message: rules.warning.message },
    isElapsedTimeExceedingThreshold(activity.endTime || activity.startTime, {
      hours: rules.info.hours,
      minutes: rules.info.minutes,
    }) && { type: "info", message: rules.info.message },
    {
      type: "none",
      message: undefined,
    },
  ];

  return potentialNotification.find(Boolean) as Notification;
};

export const isElapsedTimeExceedingThreshold = (
  date: Date,
  threshold: { days?: number; hours?: number; minutes?: number },
  now = new Date()
) => {
  const elapsedMilliseconds = now.getTime() - date.getTime();
  const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));

  const thresholdMinutes =
    (threshold.days || 0) * 24 * 60 +
    (threshold.hours || 0) * 60 +
    (threshold.minutes || 0);
  return elapsedMinutes > thresholdMinutes;
};
