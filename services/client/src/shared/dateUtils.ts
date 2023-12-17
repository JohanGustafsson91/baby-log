interface TimeParams {
  targetDate: Date;
  sourceDate: Date;
}

export const setTimeFromAnotherDate = ({
  targetDate,
  sourceDate,
}: TimeParams): Date => {
  const hours: number = sourceDate.getHours();
  const minutes: number = sourceDate.getMinutes();
  const seconds: number = sourceDate.getSeconds();

  targetDate.setHours(hours, minutes, seconds);

  return targetDate;
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

export const getElapsedTime = (date: Date) => {
  const now = new Date();
  const elapsedMilliseconds = now.getTime() - date.getTime();
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);
  const elapsedWeeks = Math.floor(elapsedDays / 7);
  const elapsedMonths = Math.floor(elapsedDays / 30);
  const elapsedYears = Math.floor(elapsedDays / 365);

  if (elapsedSeconds < 60) {
    return `${elapsedSeconds} sekund${elapsedSeconds === 1 ? "" : "er"} sen`;
  } else if (elapsedMinutes < 60) {
    return `${elapsedMinutes} minut${elapsedMinutes === 1 ? "" : "er"} sen`;
  } else if (elapsedHours < 24) {
    return `${elapsedHours} timm${elapsedHours === 1 ? "e" : "ar"} och ${
      elapsedMinutes % 60
    } minut${elapsedMinutes % 60 === 1 ? "" : "er"} sen`;
  } else if (elapsedDays < 7) {
    return `${elapsedDays} dag${elapsedDays === 1 ? "" : "ar"} sen`;
  } else if (elapsedWeeks < 4) {
    return `${elapsedWeeks} veck${elapsedWeeks === 1 ? "a" : "or"} sen`;
  } else if (elapsedMonths < 12) {
    return `${elapsedMonths} månad${elapsedMonths === 1 ? "" : "er"} sen`;
  } else {
    return `${elapsedYears} år sen`;
  }
};