import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAsync } from "@/shared/useAsync";
import { useSettings } from "@/components/SettingsProvider/SettingsProvider";
import { ActivityDTO } from "baby-log-api";
import { ActivityForm } from "./DailyActivities.ActivityForm";
import { categoriesDisplayTextMap } from "./DailyActivities.categoriesDisplayTextMap";
import {
  formatDate,
  formatTime,
  isDateInFuture,
  isValidDate,
} from "@/shared/dateUtils";
import styles from "./DailyActivities.module.css";

export const DailyActivities = () => {
  const router = useRouter();
  const { query } = router;
  const [currentDate] = ensureArray(query.day);
  const [createOrUpdateActivity] = ensureArray(query.mode);

  const { selectedChild } = useSettings();
  const {
    data: activities = [],
    status,
    execute,
    updateData,
  } = useAsync<ActivityDTO[]>();

  useEffect(
    function checkValidDay() {
      if (!isValidDate(currentDate)) {
        router.push(`/${formatDate(new Date())}`, undefined, {
          shallow: true,
        });
      }
    },
    [router, currentDate]
  );

  useEffect(
    function fetchActivitiesForDay() {
      if (!isValidDate(currentDate) || !selectedChild?.id) {
        return;
      }

      execute(async function fetchActivities() {
        const response = await fetch(
          `/api/activities/${selectedChild?.id}/between/${currentDate}/${currentDate}`
        );
        const json: ActivityDTO[] = await response.json();
        return json;
      });
    },
    [currentDate, execute, selectedChild?.id]
  );

  function navigateToDay(currentDate: Date, days: number) {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);

    return router.push(`/${formatDate(newDate)}`, undefined, {
      shallow: true,
    });
  }

  function showCreateOrUpdateActivityForm(activityId?: ActivityDTO["id"]) {
    return router.push(
      { query: { ...router.query, mode: "createOrUpdate", activityId } },
      undefined,
      {
        shallow: true,
      }
    );
  }

  function closeShowCreateOrUpdateActivityForm() {
    return router.push(
      { pathname: router.pathname, query: { day: router.query.day } },
      undefined,
      {
        shallow: true,
      }
    );
  }

  async function createNewActivity(activity: ActivityDTO) {
    const response = await fetch(`/api/activities/${selectedChild?.id}`, {
      method: "POST",
      body: JSON.stringify(activity),
    });

    if (!response.ok) {
      throw new Error("Could not create activity");
    }

    const data: ActivityDTO = await response.json();
    updateData([...activities, data]);
  }

  async function updateActivity(activity: ActivityDTO) {
    const response = await fetch(
      `/api/activities/${selectedChild?.id}/${activity.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(activity),
      }
    );

    if (!response.ok) {
      throw new Error("Could not update activity");
    }

    const data: ActivityDTO = await response.json();
    updateData(activities.map((a) => (a.id === data.id ? data : a)));
  }

  async function deleteActivity(activityId: ActivityDTO["id"]) {
    const response = await fetch(
      `/api/activities/${selectedChild?.id}/${activityId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Could not delete activity");
    }

    updateData(activities.filter((a) => a.id !== activityId));
  }

  if (!isValidDate(currentDate)) {
    return null;
  }

  return (
    <main>
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

      <div className="flex-space-between">
        <h3>Händelser</h3>
        <button onClick={() => showCreateOrUpdateActivityForm()}>
          Lägg till
        </button>
      </div>

      <div>
        {
          {
            idle: <p>Hämtar händelser...</p>,
            pending: <p>Hämtar händelser...</p>,
            success: activities.length ? (
              [...activities]
                .sort(
                  (a, b) =>
                    new Date(b.startTime).getTime() -
                    new Date(a.startTime).getTime()
                )
                .map(({ id, startTime, category, details }) => (
                  <div
                    key={id}
                    onClick={() => showCreateOrUpdateActivityForm(id)}
                    className={styles.activityItem}
                  >
                    <div className={styles.activityInfo}>
                      <div className={styles.activityTime}>
                        {formatTime(startTime)}
                      </div>
                      <div className={styles.activityCategory}>
                        <span>{categoriesDisplayTextMap[category]}</span>
                        {details && " - "}
                        {details ? (
                          <span className={styles.activityDetails}>
                            {details}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p>Inga registrerade händelser</p>
            ),
            error: <p>Kunde inte hämta händelser.</p>,
          }[status]
        }
      </div>

      {createOrUpdateActivity && (
        <ActivityForm
          date={new Date(currentDate)}
          onClose={closeShowCreateOrUpdateActivityForm}
          activityToUpdate={activities.find(
            (activity) =>
              activity.id.toString() === ensureArray(router.query.activityId)[0]
          )}
          onSubmit={async (activity, newActivity) => {
            newActivity
              ? await createNewActivity(activity)
              : await updateActivity(activity);
            closeShowCreateOrUpdateActivityForm();
          }}
          onDelete={async (activityId) => {
            await deleteActivity(activityId);
            closeShowCreateOrUpdateActivityForm();
          }}
        />
      )}
    </main>
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
