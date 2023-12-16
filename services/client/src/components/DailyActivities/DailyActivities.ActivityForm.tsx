import { ActivityDTO } from "baby-log-api";
import { ChangeEvent, useState } from "react";
import { categoriesDisplayTextMap } from "./DailyActivities.categoriesDisplayTextMap";
import {
  formatTime,
  parseTimeString,
  setTimeFromAnotherDate,
} from "@/shared/dateUtils";
import styles from "./DailyActivities.module.css";

export const ActivityForm = ({
  date,
  onClose,
  onSubmit,
  activityToUpdate,
  onDelete,
}: Props) => {
  const [form, setForm] = useState<ActivityDTO>({
    category: activityToUpdate?.category ?? categories[0],
    id: activityToUpdate?.id ?? 0,
    details: activityToUpdate?.details ?? "",
    startTime:
      activityToUpdate?.startTime ??
      setTimeFromAnotherDate({ sourceDate: new Date(), targetDate: date }),
    endTime: activityToUpdate?.endTime ?? undefined,
  });

  function updateForm(e: Pick<ChangeEvent<HTMLInputElement>, "target">) {
    return setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className={styles.modal}>
      <div className="flex-space-between">
        <h2>{activityToUpdate ? "Uppdatera" : "Lägg till"} aktivitet</h2>
        <button onClick={onClose}>Stäng</button>
      </div>

      <div className={styles.formGroup}>
        <h3>Kategori</h3>
        {categories.map((option) => (
          <label className={styles.label} key={option}>
            <input
              type="radio"
              name="category"
              value={option}
              checked={form.category === option}
              onChange={updateForm}
            />
            {categoriesDisplayTextMap[option]}
          </label>
        ))}
      </div>

      <div className={styles.formGroup}>
        <h3>Tid</h3>
        <TimeInput
          name="startTime"
          value={formatTime(form.startTime)}
          onValidTimeInput={(timeString) =>
            setForm((prev) => ({
              ...prev,
              startTime: parseTimeString(timeString, date),
            }))
          }
        />
      </div>

      <div className={styles.formGroup}>
        <h3>Info</h3>
        <input name="details" value={form.details} onChange={updateForm} />
      </div>

      <div className={`flex-space-between ${styles.formGroup}`}>
        <button onClick={() => onSubmit(form, !Boolean(activityToUpdate))}>
          {activityToUpdate ? "Uppdatera" : "Lägg till"}
        </button>
        {activityToUpdate ? (
          <button onClick={() => onDelete(activityToUpdate.id)}>Ta bort</button>
        ) : null}
      </div>
    </div>
  );
};

const categories: ActivityDTO["category"][] = [
  "bath",
  "diaper-change",
  "food",
  "health-check",
  "hygiene",
  "other",
  "sleep",
];

const TimeInput = ({
  name,
  value,
  onValidTimeInput,
}: {
  name: string;
  value: string;
  onValidTimeInput: (arg: string) => void;
}) => {
  const [time, setTime] = useState(value);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const validInputRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const inputValue = event.target.value;

    setTime(inputValue);

    if (validInputRegex.test(inputValue)) {
      onValidTimeInput(inputValue);
    }
  };

  return (
    <input
      type="text"
      name={name}
      value={time}
      placeholder="HH:MM"
      onChange={onChange}
      onBlur={() => setTime(value)}
    />
  );
};

interface Props {
  onClose: () => void;
  activityToUpdate?: ActivityDTO;
  date: Date;
  onSubmit: (activity: ActivityDTO, newActivity: boolean) => void;
  onDelete: (activityId: ActivityDTO["id"]) => void;
}
