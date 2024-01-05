import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAsync } from "@/shared/useAsync";
import { ActivityDTO } from "baby-log-api";
import { ActivityForm } from "./DailyActivities.ActivityForm";
import { formatDate, isDateInFuture, isValidDate } from "@/shared/dateUtils";
import { Header } from "../Header/Header";
import { IconButton } from "../Button/Button.IconButton";
import { useSettings } from "../App/App.SettingsProvider";
import { ActivityItem } from "./DailyActivities.ActivityItem";

export const DailyActivities = () => {
  const { query, push: navigate, pathname } = useRouter();
  const [currentDate] = ensureArray(query.day);
  const [createActivityFormVisible] = ensureArray(query.mode);

  const { selectedChild } = useSettings();
  const {
    data: activities = [],
    status,
    executeAsync,
    updateData: updateActivities,
  } = useAsync<ActivityDTO[]>();

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

      executeAsync(async function fetchActivities() {
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
              [...activities]
                .map((activity) => ({
                  ...activity,
                  startTime: new Date(activity.startTime),
                  endTime: activity.endTime
                    ? new Date(activity.endTime)
                    : activity.endTime,
                }))
                .sort(
                  (a, b) =>
                    new Date(b.startTime).getTime() -
                    new Date(a.startTime).getTime()
                )
                .map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    onDeleted={onDeletedActivity}
                    onUpdated={onUpdatedActivity}
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
