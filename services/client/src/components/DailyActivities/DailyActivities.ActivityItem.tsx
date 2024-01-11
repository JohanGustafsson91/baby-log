import { ActivityDTO } from "baby-log-api";
import styles from "./DailyActivities.module.css";
import { formatTime, getElapsedTime } from "@/shared/dateUtils";
import { categoriesDisplayTextMap } from "./DailyActivities.categoriesDisplayTextMap";
import { useState } from "react";
import { useAsync } from "@/shared/useAsync";
import { useSettings } from "../App/App.SettingsProvider";
import { ActivityForm } from "./DailyActivities.ActivityForm";

export const ActivityItem = ({ activity, onDeleted, onUpdated }: Props) => {
  const [mode, setMode] = useState<"viewActivity" | "updateActivity">(
    "viewActivity"
  );
  const { selectedChild } = useSettings();
  const { status, executeAsync } = useAsync();

  const { id, startTime, endTime, category, details } = activity;

  function setViewMode() {
    setMode("viewActivity");
  }

  function showEditActivityForm() {
    setMode("updateActivity");
  }

  async function updateActivity(form: ActivityDTO) {
    setViewMode();

    executeAsync(async () => {
      try {
        onUpdated(form);

        const response = await fetch(
          `/api/activities/${selectedChild?.id}/${form.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(form),
          }
        );

        if (!response.ok) {
          throw new Error("Could not update activity");
        }

        const data: ActivityDTO = await response.json();
        return onUpdated(data);
      } catch (error) {
        onUpdated(activity);
      }
    });
  }

  async function deleteActivity(activityId: ActivityDTO["id"]) {
    setViewMode();

    executeAsync(async () => {
      const response = await fetch(
        `/api/activities/${selectedChild?.id}/${activityId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Could not delete activity");
      }

      return onDeleted(id);
    });
  }

  const totalTimeText = activity.endTime
    ? getElapsedTime(activity.startTime, activity.endTime)
    : "";

  const detailsText =
    details || totalTimeText ? `${details}${totalTimeText}` : "";

  return {
    viewActivity: (
      <div className={styles.activityItem}>
        <div className={styles.activityItemTimeWrapper}>
          <div className={styles.activityItemTimeAndCircle}>
            <div className={styles.activityItemTimeCircle}>
              {categoriesDisplayTextMap[category].icon}
            </div>
            <span className={styles.activityTime}>
              {formatTime(startTime)}
              {endTime ? (
                <>
                  <br />
                  {formatTime(endTime)}
                </>
              ) : (
                ""
              )}
            </span>
          </div>
          <div className={styles.activityItemTimeLine} />
        </div>
        <div
          key={id}
          onClick={showEditActivityForm}
          className={`${styles.activityItemCard} ${
            status === "pending" ? styles.loading : ""
          }`}
        >
          <div className={styles.activityInfo}>
            <div className={styles.activityText}>
              <div className={styles.activityCategory}>
                <span>{categoriesDisplayTextMap[category].text}</span>
                {detailsText ? (
                  <span className={styles.activityDetails}>{detailsText}</span>
                ) : null}
              </div>
            </div>

            <span className={styles.activityElapsedTime}>
              {getElapsedTime(startTime)}
              {endTime && category === "sleep" ? (
                <div>Vaknade för {getElapsedTime(endTime)}</div>
              ) : null}
            </span>
          </div>
        </div>
      </div>
    ),
    updateActivity: (
      <ActivityForm
        date={activity.startTime}
        onClose={setViewMode}
        activityToUpdate={activity}
        onSubmit={updateActivity}
        onDelete={deleteActivity}
      />
    ),
  }[mode];
};

interface Props {
  activity: ActivityDTO;
  onDeleted: (id: ActivityDTO["id"]) => void;
  onUpdated: (a: ActivityDTO) => void;
}
