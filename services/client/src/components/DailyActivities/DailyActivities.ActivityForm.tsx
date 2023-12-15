import { ActivityDTO } from "baby-log-api";
import { ChangeEvent, useState } from "react";
import { categoryToTextMap } from "./DailyActivities.categoryToTextMap";
import {
  formatTime,
  parseTimeString,
  setTimeFromAnotherDate,
} from "@/shared/dateUtils";

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
    endTime: activityToUpdate?.endTime,
  });

  function updateForm(e: ChangeEvent<HTMLInputElement>) {
    return setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className="modal">
      <div className="flex-space-between">
        <h2>{activityToUpdate ? "Uppdatera" : "Lägg till"} aktivitet</h2>
        <button onClick={onClose}>Stäng</button>
      </div>

      <div className="formgroup">
        <h3>Kategori</h3>
        {categories.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="category"
              value={option}
              checked={form.category === option}
              onChange={updateForm}
            />
            {categoryToTextMap[option]}
          </label>
        ))}
      </div>

      <div className="formgroup">
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

      <div className="formgroup">
        <h3>Info</h3>
        <input name="details" value={form.details} onChange={updateForm} />
      </div>

      <div className="formgroup">
        <button onClick={() => onSubmit(form, !Boolean(activityToUpdate))}>
          {activityToUpdate ? "Uppdatera" : "Lägg till"}
        </button>
      </div>

      {activityToUpdate ? (
        <div className="formgroup">
          <button onClick={() => onDelete(activityToUpdate.id)}>Ta bort</button>
        </div>
      ) : null}
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

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const inputValue = event.target.value;

    setTime(inputValue);

    if (regex.test(inputValue)) {
      onValidTimeInput(inputValue);
    }
  };

  return (
    <input
      type="text"
      name={name}
      value={time}
      placeholder="HH:MM"
      onChange={handleTimeChange}
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
