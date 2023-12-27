import { ActivityDTO } from "baby-log-api";
import styles from "./DailyActivities.module.css";
import { formatTime, getElapsedTime } from "@/shared/dateUtils";
import { categoriesDisplayTextMap } from "./DailyActivities.categoriesDisplayTextMap";
import { useState } from "react";
import { useAsync } from "@/shared/useAsync";
import { useSettings } from "../App/App.SettingsProvider";
import { ActivityForm } from "./DailyActivities.ActivityForm";

export const ActivityItem = ({ activity, onDeleted, onUpdated }: Props) => {
  const [mode, setMode] = useState<"default" | "edit">("default");
  const { id, startTime, endTime, category, details } = activity;
  const { selectedChild } = useSettings();
  const { status, executeAsync } = useAsync();

  function resetMode() {
    setMode("default");
  }

  function showEditActivityForm() {
    setMode("edit");
  }

  async function updateActivity(form: ActivityDTO) {
    resetMode();

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
    resetMode();

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

  if (mode === "edit") {
    return (
      <ActivityForm
        date={activity.startTime}
        onClose={resetMode}
        activityToUpdate={activity}
        onSubmit={updateActivity}
        onDelete={deleteActivity}
      />
    );
  }

  const totalTimeText = activity.endTime
    ? getElapsedTime(activity.startTime, activity.endTime)
    : "";

  const detailsText =
    details || totalTimeText ? `${details}${totalTimeText}` : "";

  return (
    <div
      key={id}
      onClick={showEditActivityForm}
      className={`${styles.activityItem} ${
        status === "pending" ? styles.loading : ""
      }`}
    >
      <div className={styles.activityInfo}>
        <div className={styles.activityText}>
          <p className={styles.activityTime}>
            {formatTime(startTime)}
            {endTime ? ` - ${formatTime(endTime)}` : ""}
          </p>
          <div className={styles.activityCategory}>
            <span>{categoriesDisplayTextMap[category]}</span>
            {detailsText ? (
              <span className={styles.activityDetails}>{detailsText}</span>
            ) : null}
          </div>
        </div>

        <span className={styles.activityElapsedTime}>
          {getElapsedTime(startTime)}
        </span>
      </div>
    </div>
  );
};

interface Props {
  activity: ActivityDTO;
  onDeleted: (id: ActivityDTO["id"]) => void;
  onUpdated: (a: ActivityDTO) => void;
}
