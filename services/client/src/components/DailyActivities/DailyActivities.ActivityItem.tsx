import { ActivityDTO } from "baby-log-api";
import styles from "./DailyActivities.module.css";
import { formatTime, getElapsedTime } from "@/shared/dateUtils";
import { categoriesDisplayTextMap } from "./DailyActivities.categoriesDisplayTextMap";
import { MouseEvent, useState } from "react";
import { useAsync } from "@/shared/useAsync";
import { useSettings } from "../App/App.SettingsProvider";
import { ActivityForm } from "./DailyActivities.ActivityForm";
import { IconButton } from "../Button/Button.IconButton";

export const ActivityItem = ({
  activity,
  currentDate,
  onDeleted,
  onUpdated,
}: Props) => {
  const [mode, setMode] = useState<"default" | "selectAction" | "edit">(
    "default"
  );
  const { id, startTime, endTime, category, details } = activity;
  const { selectedChild } = useSettings();
  const { status: deleteStatus, execute: executeDeleteAsync } = useAsync();
  const { status: editStatus, execute: executeEditAsync } = useAsync();

  function resetMode() {
    setMode("default");
  }

  function showEditActivityForm(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setMode("edit");
  }

  async function updateActivity(activity: ActivityDTO) {
    resetMode();

    executeEditAsync(async () => {
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
      return onUpdated(data);
    });
  }

  async function deleteActivity(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    resetMode();

    executeDeleteAsync(async () => {
      const response = await fetch(
        `/api/activities/${selectedChild?.id}/${id}`,
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
        date={new Date(currentDate)}
        onClose={resetMode}
        activityToUpdate={activity}
        onSubmit={updateActivity}
      />
    );
  }

  return (
    <div
      key={id}
      onClick={() =>
        setMode((prev) =>
          prev === "selectAction" ? "default" : "selectAction"
        )
      }
      className={`${styles.activityItem} ${
        [deleteStatus, editStatus].includes("pending") ? styles.loading : ""
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
            {details && " - "}
            {details ? (
              <span className={styles.activityDetails}>{details}</span>
            ) : null}
          </div>
        </div>
        {
          {
            default: (
              <span className={styles.activityElapsedTime}>
                {getElapsedTime(startTime)}
              </span>
            ),
            selectAction: (
              <div className={styles.activityButtonContainer}>
                <IconButton icon="edit" onClick={showEditActivityForm} />
                <IconButton
                  icon="delete"
                  onClick={deleteActivity}
                  disabled={deleteStatus === "pending"}
                />
              </div>
            ),
            edit: null,
          }[mode]
        }
      </div>
    </div>
  );
};

interface Props {
  activity: ActivityDTO;
  onDeleted: (id: ActivityDTO["id"]) => void;
  onUpdated: (a: ActivityDTO) => void;
  currentDate: string;
}
