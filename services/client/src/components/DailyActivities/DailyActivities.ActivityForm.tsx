import { ActivityDTO } from "baby-log-api";
import { ChangeEvent, useRef, useState } from "react";
import { categoriesDisplayTextMap } from "./DailyActivities.categoriesDisplayTextMap";
import {
  formatTime,
  parseTimeString,
  setTimeFromAnotherDate,
} from "@/shared/dateUtils";
import styles from "./DailyActivities.module.css";
import { Header } from "../Header/Header";
import { IconButton } from "../Button/Button.IconButton";
import { useSettings } from "../App/App.SettingsProvider";

export const ActivityForm = ({
  date,
  onClose,
  onSubmit,
  activityToUpdate,
  onDelete,
}: Props) => {
  const categoryWithEndTime = categoriesWithEndTime.includes(
    activityToUpdate?.category ?? categories[0]
  );

  const [form, setForm] = useState<ActivityDTO>(() =>
    activityToUpdate
      ? {
          ...activityToUpdate,
          endTime:
            categoryWithEndTime && !activityToUpdate?.endTime
              ? setTimeFromAnotherDate({
                  sourceDate: new Date(),
                  targetDate: date,
                })
              : activityToUpdate?.endTime,
        }
      : {
          category: categories[0],
          id: -1,
          details: "",
          startTime: setTimeFromAnotherDate({
            sourceDate: new Date(),
            targetDate: date,
          }),
          endTime: undefined,
        }
  );
  const formRef = useRef<HTMLFormElement | null>(null);
  const { latestActivityDetails } = useSettings();

  const latestDetailsForCategory = latestActivityDetails?.[form.category] || [];

  function updateForm(e: Pick<ChangeEvent<HTMLInputElement>, "target">) {
    return setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSelectActivityDetails(details: ActivityDTO["details"]) {
    return function onClick() {
      formRef.current?.scrollTo({
        top: formRef.current.scrollHeight,
        behavior: "smooth",
      });

      return setForm((prev) => ({
        ...prev,
        details,
      }));
    };
  }

  const title = activityToUpdate ? "Uppdatera" : "Lägg till";

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <Header
          title={`${title} aktivitet`}
          icons={<IconButton icon="close" onClick={onClose} />}
        />

        <form
          className="content"
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return onSubmit(form);
          }}
        >
          <div className={styles.formGroup}>
            <h4>Kategori</h4>

            {categories.map((option) => (
              <label
                className={`${styles.customRadioButton} ${
                  form.category === option
                    ? styles.customRadioButtonChecked
                    : ""
                }`}
                key={option}
              >
                <input
                  type="radio"
                  name="category"
                  value={option}
                  checked={form.category === option}
                  aria-checked={form.category === option}
                  onChange={updateForm}
                />
                <span>{categoriesDisplayTextMap[option].text}</span>
                {categoriesDisplayTextMap[option].icon}
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
                    endTime: timeString
                      ? parseTimeString(timeString, date)
                      : null,
                  }))
                }
              />
            ) : null}
          </div>

          <div className={styles.formGroup}>
            <h4>Info</h4>

            <input
              name="details"
              value={form.details}
              onChange={updateForm}
              placeholder="Ange info"
            />

            {latestDetailsForCategory.length ? (
              <div>
                <h5>Senaste</h5>
                {latestDetailsForCategory.map((latestDetail) => (
                  <label
                    className={`${styles.customRadioButton}`}
                    key={latestDetail}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={latestDetail}
                      onChange={handleSelectActivityDetails(latestDetail)}
                    />
                    <span>{latestDetail}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>

          <div className={`flex-space-between ${styles.formGroup}`}>
            <button type="submit">{title}</button>
            {activityToUpdate && onDelete ? (
              <button
                type="button"
                className="btn-warning"
                onClick={() => onDelete(activityToUpdate.id)}
              >
                Ta bort
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

const categories: ActivityDTO["category"][] = [
  "sleep",
  "food",
  "diaper-change",
  "diaper-change-dirty",
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
  onSubmit: (activity: ActivityDTO) => void;
  onDelete?: (id: ActivityDTO["id"]) => void;
}
