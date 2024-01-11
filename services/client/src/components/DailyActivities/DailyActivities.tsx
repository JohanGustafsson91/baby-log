import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAsync } from "@/shared/useAsync";
import { ActivityDTO } from "baby-log-api";
import { ActivityForm } from "./DailyActivities.ActivityForm";
import {
  formatDate,
  getElapsedTime,
  isDateInFuture,
  isSameDate,
  isValidDate,
} from "@/shared/dateUtils";
import { Header } from "../Header/Header";
import { IconButton } from "../Button/Button.IconButton";
import { useSettings } from "../App/App.SettingsProvider";
import { ActivityItem } from "./DailyActivities.ActivityItem";

export const DailyActivities = () => {
  const { query, push: navigate, pathname } = useRouter();
  const [currentDate] = ensureArray(query.day);
  const [createActivityFormVisible] = ensureArray(query.mode);
  const { selectedChild } = useSettings();
  const [, reRender] = useState<unknown | null>(null);

  const {
    data: activities = [],
    status,
    executeAsync,
    updateData: updateActivities,
  } = useAsync<ActivityDTO[]>();

  useEffect(
    function reRenderViewEveryMinute() {
      const timerId = setInterval(() => {
        reRender({});
      }, 60000);

      return () => clearInterval(timerId);
    },
    [reRender]
  );

  useEffect(
    function checkValidDay() {
      if (!isValidDate(currentDate)) {
        navigate(`/${formatDate(new Date())}`, undefined, {
          shallow: true,
        });
      }
    },
    [navigate, currentDate]
  );

  useEffect(
    function fetchActivitiesForDay() {
      if (!isValidDate(currentDate) || !selectedChild?.id) {
        return;
      }

      executeAsync(async () => {
        const response = await fetch(
          `/api/activities/${selectedChild?.id}/between/${currentDate}/${currentDate}`
        );
        const json: ActivityDTO[] = await response.json();
        return json;
      });
    },
    [currentDate, executeAsync, selectedChild?.id]
  );

  function navigateToDay(currentDate: Date, days: number) {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);

    return navigate(`/${formatDate(newDate)}`, undefined, {
      shallow: true,
    });
  }

  function showCreateActivityForm() {
    return navigate({ query: { ...query, mode: "create" } }, undefined, {
      shallow: true,
    });
  }

  function closeCreateActivityForm() {
    return navigate({ pathname, query: { day: query.day } }, undefined, {
      shallow: true,
    });
  }

  async function createNewActivity(newActivity: ActivityDTO) {
    try {
      await closeCreateActivityForm();
      updateActivities((prev) => [...(prev || []), newActivity]);

      const response = await fetch(`/api/activities/${selectedChild?.id}`, {
        method: "POST",
        body: JSON.stringify(newActivity),
      });

      if (!response.ok) {
        throw new Error("Could not create activity");
      }

      const data: ActivityDTO = await response.json();

      return updateActivities(
        (prev) =>
          prev?.map((activity) =>
            activity.id === newActivity.id ? data : activity
          ) || []
      );
    } catch (error) {
      updateActivities(
        (prev) => prev?.filter(({ id }) => id !== newActivity.id) || []
      );
    }
  }

  async function onUpdatedActivity(updatedActivity: ActivityDTO) {
    return updateActivities(
      (prev) =>
        prev?.map((activity) =>
          activity.id === updatedActivity.id ? updatedActivity : activity
        ) || []
    );
  }

  async function onDeletedActivity(activityId: ActivityDTO["id"]) {
    return updateActivities(
      (prev) => prev?.filter((a) => a.id !== activityId) ?? []
    );
  }

  if (!isValidDate(currentDate)) {
    return null;
  }

  const sortedActivities = [...activities]
    .map((activity) => ({
      ...activity,
      startTime: new Date(activity.startTime),
      endTime: activity.endTime ? new Date(activity.endTime) : activity.endTime,
    }))
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

  const showNotifications = !(
    sortedActivities[0]?.category === "sleep" &&
    new Date().getHours() >= NIGHT_SLEEP_TIME
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

  return (
    <>
      <Header
        title={`${selectedChild?.name}s dag`}
        icons={
          <IconButton icon="add" onClick={() => showCreateActivityForm()} />
        }
      >
        <div className="flex-space-between mb-16">
          <button
            className="button-small"
            onClick={() => navigateToDay(new Date(currentDate), -1)}
          >
            {"<"}
          </button>
          <span>{currentDate}</span>
          <button
            className="button-small"
            disabled={isDateInFuture({ currentDate: new Date(currentDate) })}
            onClick={() => navigateToDay(new Date(currentDate), 1)}
          >
            {">"}
          </button>
        </div>
      </Header>

      <div className="content">
        <div className="flex-space-between">
          <h3>Händelser</h3>
        </div>

        {
          {
            idle: null,
            pending: <p>Hämtar händelser...</p>,
            success: activities.length ? (
              sortedActivities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onDeleted={onDeletedActivity}
                  onUpdated={onUpdatedActivity}
                  notification={
                    notificationsForActivities.find(
                      (notification) => notification.id === activity.id
                    )?.notification
                  }
                />
              ))
            ) : (
              <p>Inga registrerade händelser</p>
            ),
            error: <p>Kunde inte hämta händelser.</p>,
          }[status]
        }

        {createActivityFormVisible && (
          <ActivityForm
            date={new Date(currentDate)}
            onClose={closeCreateActivityForm}
            onSubmit={createNewActivity}
          />
        )}
      </div>
    </>
  );
};

const notificationSettings: Record<
  ActivityDTO["category"],
  { info: NotificationTime; warning: NotificationTime } | undefined
> = {
  sleep: { info: { hours: 3, minutes: 0 }, warning: { hours: 4, minutes: 0 } },
  food: { info: { hours: 2, minutes: 0 }, warning: { hours: 3, minutes: 0 } },
  "diaper-change": {
    info: { hours: 2, minutes: 30 },
    warning: { hours: 4, minutes: 0 },
  },
  "diaper-change-dirty": undefined,
  "health-check": undefined,
  bath: undefined,
  hygiene: undefined,
  other: undefined,
};

const NIGHT_SLEEP_TIME = 19;

type NotificationTime = { hours: number; minutes: number };
type Notification = "none" | "info" | "warning";

const getNotification = (activity: ActivityDTO): Notification => {
  const definedRules = notificationSettings[activity.category];

  if (!definedRules) {
    return "none";
  }

  const { elapsedHours, elapsedMinutes } = getElapsedTime(
    activity.endTime ?? activity.startTime
  );

  if (
    elapsedHours + 1 > definedRules.warning.hours &&
    elapsedMinutes > definedRules.warning.minutes
  ) {
    return "warning";
  }

  if (
    elapsedHours + 1 > definedRules.info.hours &&
    elapsedMinutes > definedRules.info.minutes
  ) {
    return "info";
  }

  return "none";
};

// TODO share
export const ensureArray = (input: string | string[] | undefined): string[] => {
  if (input === undefined) {
    return [];
  } else if (typeof input === "string") {
    return [input];
  } else {
    return input;
  }
};
