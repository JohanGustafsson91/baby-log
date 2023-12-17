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
        <h3>{activityToUpdate ? "Uppdatera" : "Lägg till"} aktivitet</h3>
        <button onClick={onClose}>Stäng</button>
      </div>

      <div className={styles.formGroup}>
        <h4>Kategori</h4>
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
        <h4>Tid</h4>
        <TimeInput
          name="startTime"
          value={formatTime(form.startTime)}
          isValidInput={(value) => validInputRegex().test(value)}
          onValidTimeInput={(timeString) =>
            setForm((prev) => ({
              ...prev,
              startTime: parseTimeString(timeString, date),
            }))
          }
        />
        {categoriesWithEndTime.includes(form.category) ? (
          <TimeInput
            name="endTime"
            value={form.endTime ? formatTime(form.endTime) : ""}
            isValidInput={(value) =>
              validInputRegex().test(value) || value === ""
            }
            onValidTimeInput={(timeString) =>
              setForm((prev) => ({
                ...prev,
                endTime: timeString ? parseTimeString(timeString, date) : null,
              }))
            }
          />
        ) : null}
      </div>

      <div className={styles.formGroup}>
        <h4>Info</h4>
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
  "food",
  "diaper-change",
  "sleep",
  "hygiene",
  "bath",
  "health-check",
  "other",
];

const categoriesWithEndTime: ActivityDTO["category"][] = ["sleep"];

const validInputRegex = () => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const TimeInput = ({
  name,
  value,
  isValidInput,
  onValidTimeInput,
}: {
  name: string;
  value: string;
  isValidInput: (inputValue: string) => boolean;
  onValidTimeInput: (arg: string) => void;
}) => {
  const [time, setTime] = useState(value);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setTime(inputValue);

    if (isValidInput(inputValue)) {
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