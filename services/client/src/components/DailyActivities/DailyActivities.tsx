import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAsync } from "@/shared/useAsync";
import { useSettings } from "@/components/SettingsProvider/SettingsProvider";
import { ActivityDTO } from "baby-log-api";
import { ActivityForm } from "./DailyActivities.ActivityForm";
import { categoryToTextMap } from "./DailyActivities.categoryToTextMap";
import { formatDate, formatTime, isValidDate } from "@/shared/dateUtils";

export const DailyActivities = () => {
  const router = useRouter();
  const { selectedChild } = useSettings();
  const {
    data: activities = [],
    status,
    execute,
    updateData,
  } = useAsync<ActivityDTO[]>();

  const [date] = ensureArray(router.query.day);

  useEffect(
    function initDay() {
      if (!isValidDate(date)) {
        router.push(`/${formatDate()}`, undefined, {
          shallow: true,
        });
      }
    },
    [router, date]
  );

  useEffect(
    function fetchActivitiesForDay() {
      if (!isValidDate(date) || !selectedChild?.id) {
        return;
      }

      execute(async function fetchActivities() {
        const response = await fetch(
          `/api/activities/${selectedChild?.id}/between/${date}/${date}`
        );
        const json: ActivityDTO[] = await response.json();
        return json;
      });
    },
    [date, execute, selectedChild?.id]
  );

  function changeDay(currentDate: Date, days: number) {
    const newDate = new Date(currentDate);

    newDate.setDate(currentDate.getDate() + days);

    return router.push(`/${formatDate(newDate)}`, undefined, {
      shallow: true,
    });
  }

  function handleAddOrUpdateActivity(activityId?: ActivityDTO["id"]) {
    return router.push(
      { query: { ...router.query, mode: "addOrUpdate", activityId } },
      undefined,
      {
        shallow: true,
      }
    );
  }

  function handleOnClose() {
    return router.push(
      { pathname: router.pathname, query: { day: router.query.day } },
      undefined,
      {
        shallow: true,
      }
    );
  }

  async function createNewActivity(activity: ActivityDTO) {
    try {
      const response = await fetch(`/api/activities/${selectedChild?.id}`, {
        method: "POST",
        body: JSON.stringify(activity),
      });

      if (!response.ok) {
        throw new Error("Could not create activity");
      }

      const data: ActivityDTO = await response.json();
      updateData([...activities, data]);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateActivity(activity: ActivityDTO) {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteActivity(activityId: ActivityDTO["id"]) {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  const currentDate = new Date(date);
  const nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);
  const isNextDayInFuture = nextDay > new Date();

  const [addOrUpdateActivity] = ensureArray(router.query.mode);

  return (
    <main>
      <div className="flex-space-between">
        <button onClick={() => changeDay(new Date(date), -1)}>Back</button>
        <span>{date}</span>
        {!isNextDayInFuture ? (
          <button onClick={() => changeDay(new Date(date), 1)}>Next</button>
        ) : null}
      </div>

      <div className="flex-space-between">
        <h3>Händelser</h3>
        <button onClick={() => handleAddOrUpdateActivity()}>Lägg till</button>
      </div>

      <div>
        {
          {
            idle: null,
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
                    className="list-item"
                    onClick={() => handleAddOrUpdateActivity(id)}
                  >
                    <div>{formatTime(startTime)}</div>
                    {categoryToTextMap[category]}
                    {details ? ` - ${details}` : ""}
                  </div>
                ))
            ) : (
              <p>Inga registrerade händelser</p>
            ),
            error: <p>Kunde inte hämta händelser.</p>,
          }[status]
        }
      </div>

      {addOrUpdateActivity && (
        <ActivityForm
          date={new Date(date)}
          onClose={handleOnClose}
          activityToUpdate={activities.find(
            (activity) =>
              activity.id.toString() === ensureArray(router.query.activityId)[0]
          )}
          onSubmit={async (activity, newActivity) => {
            newActivity
              ? await createNewActivity(activity)
              : await updateActivity(activity);
            handleOnClose();
          }}
          onDelete={async (activityId) => {
            await deleteActivity(activityId);
            handleOnClose();
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
