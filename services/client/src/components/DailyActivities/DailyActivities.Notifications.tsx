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

type ActivityNotificationSettings = Record<
  ActivityDTO["category"],
  | {
      timeSince: Array<{
        timeThreshold: TimeThreshold;
        type: "info" | "warning";
        message: NotificationMessage;
      }>;
    }
  | undefined
>;

interface TimeThreshold {
  days?: number;
  hours?: number;
  minutes: number;
}

interface NotificationMessage {
  title: string;
  body?: string;
}

const activityNotificationSettings: ActivityNotificationSettings = {
  sleep: {
    timeSince: [
      {
        type: "warning",
        timeThreshold: { hours: 3, minutes: 59 },
        message: { title: "Sova", body: "Är trött" },
      },
      {
        type: "info",
        timeThreshold: { hours: 2, minutes: 59 },
        message: { title: "Sova", body: "Börjar bli trött" },
      },
    ],
  },
  food: {
    timeSince: [
      {
        type: "warning",
        timeThreshold: { hours: 2, minutes: 59 },
        message: { title: "Äta", body: "Är hungrig" },
      },
      {
        type: "info",
        timeThreshold: { hours: 1, minutes: 59 },
        message: { title: "Äta", body: "Börjar bli hungrig" },
      },
    ],
  },
  "diaper-change": {
    timeSince: [
      {
        type: "warning",
        timeThreshold: { hours: 3, minutes: 59 },
        message: { title: "Blöja", body: "Är smutsig" },
      },
      {
        type: "info",
        timeThreshold: { hours: 2, minutes: 29 },
        message: { title: "Blöja", body: "Börjar bli smutsig" },
      },
    ],
  },
  "diaper-change-dirty": undefined,
  "health-check": undefined,
  bath: undefined,
  hygiene: undefined,
  other: undefined,
};

const NIGHT_SLEEP_START_TIME = 19;

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
  | { type: "info"; message: NotificationMessage }
  | { type: "warning"; message: NotificationMessage };

const getNotification = (activity: ActivityDTO): Notification => {
  const rules = activityNotificationSettings[activity.category];

  return [
    ...(rules?.timeSince ?? []).map(
      ({ timeThreshold, type, message }) =>
        isElapsedTimeExceedingThreshold({
          date: activity.endTime || activity.startTime,
          timeThreshold,
        }) && {
          type,
          message,
        }
    ),
    {
      type: "none",
      message: undefined,
    },
  ].find(Boolean) as Notification;
};

export const isElapsedTimeExceedingThreshold = ({
  date,
  timeThreshold,
  now = new Date(),
}: {
  date: Date;
  timeThreshold: TimeThreshold;
  now?: Date;
}) => {
  const elapsedMilliseconds = now.getTime() - date.getTime();
  const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));

  const thresholdMinutes =
    (timeThreshold.days || 0) * 24 * 60 +
    (timeThreshold.hours || 0) * 60 +
    (timeThreshold.minutes || 0);
  return elapsedMinutes > thresholdMinutes;
};
