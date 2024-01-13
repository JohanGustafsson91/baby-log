interface TimeParams {
  targetDate: Date;
  sourceDate: Date;
}

export const setTimeFromAnotherDate = ({
  targetDate,
  sourceDate,
}: TimeParams): Date => {
  const newSourceDate = new Date(sourceDate);
  const hours: number = newSourceDate.getHours();
  const minutes: number = newSourceDate.getMinutes();
  const seconds: number = newSourceDate.getSeconds();

  const newTargetDate = new Date(targetDate);
  newTargetDate.setHours(hours, minutes, seconds);

  return newTargetDate;
};

export const parseTimeString = (timeString: string, date = new Date()) => {
  const [hours, minutes] = timeString.split(":").map(Number);

  if (
    [
      isNaN(hours),
      isNaN(minutes),
      hours < 0,
      hours > 23,
      minutes < 0,
      minutes > 59,
    ].some(Boolean)
  ) {
    throw new Error("Invalid time format");
  }

  const currentDate = new Date(date);
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  return currentDate;
};

export const extractTimeAndDate = (date: Date) => {
  const hours: string = String(date.getHours()).padStart(2, "0");
  const minutes: string = String(date.getMinutes()).padStart(2, "0");
  const seconds: string = String(date.getSeconds()).padStart(2, "0");

  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");

  return {
    hours,
    minutes,
    seconds,
    year,
    month,
    day,
  };
};

export const isValidDate = (dateString: string) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const formatDate = (now = new Date()) => {
  const { year, month, day } = extractTimeAndDate(new Date(now));
  return `${year}-${month}-${day}`;
};

export const formatTime = (now = new Date()) => {
  const { hours, minutes } = extractTimeAndDate(new Date(now));
  return `${hours}:${minutes}`;
};

export const isDateInFuture = ({ currentDate }: { currentDate: Date }) => {
  const nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);
  return nextDay > new Date();
};

export const getElapsedTime = (date: Date, now = new Date()) => {
  const elapsedMilliseconds = now.getTime() - date.getTime();
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);
  const elapsedWeeks = Math.floor(elapsedDays / 7);
  const elapsedMonths = Math.floor(elapsedDays / 30);
  const elapsedYears = Math.floor(elapsedDays / 365);

  if (elapsedSeconds < 60) {
    return `${elapsedSeconds} sek`;
  } else if (elapsedMinutes < 60) {
    return `${elapsedMinutes} min`;
  } else if (elapsedHours < 24) {
    return `${elapsedHours} tim. ${elapsedMinutes % 60} min`;
  } else if (elapsedDays < 7) {
    return `${elapsedDays} dag${elapsedDays === 1 ? "" : "ar"}`;
  } else if (elapsedWeeks < 4) {
    return `${elapsedWeeks} veck${elapsedWeeks === 1 ? "a" : "or"}`;
  } else if (elapsedMonths < 12) {
    return `${elapsedMonths} månad${elapsedMonths === 1 ? "" : "er"}`;
  } else {
    return `${elapsedYears} år`;
  }
};

export const isSameDate = (date1: Date, date2: Date): boolean =>
  [
    date1.getFullYear() === date2.getFullYear(),
    date1.getMonth() === date2.getMonth(),
    date1.getDate() === date2.getDate(),
  ].every(Boolean);
