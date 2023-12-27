import { ActivityDTO } from "baby-log-api";

export const categoriesDisplayTextMap: Record<
  ActivityDTO["category"],
  {
    text: string;
    icon: JSX.Element;
  }
> = {
  "diaper-change": {
    text: "Blöjbyte",
    icon: <DiaperIcon />,
  },
  "diaper-change-dirty": {
    text: "Blöjbyte",
    icon: <PoopIcon />,
  },
  bath: {
    text: "Bad",
    icon: <BathIcon />,
  },
  food: {
    text: "Mat",
    icon: <FoodIcon />,
  },
  hygiene: {
    text: "Hygien",
    icon: <HygienIcon />,
  },
  sleep: {
    text: "Sov",
    icon: <SleepIcon />,
  },
  other: {
    text: "Annat",
    icon: <OtherIcon />,
  },
  "health-check": {
    text: "Hälsa",
    icon: <HealthCheckIcon width="1em" height="1em" />,
  },
};

function DiaperIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...defaultProps}
      {...props}
    >
      <g
        fill="none"
        stroke={defaultProps.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      >
        <path d="M6 11H42L42 19C42 19 42 27 38 31C34 35 27.8421 37 27.8421 37H20.1579C20.1579 37 14 35 10 31C6 27 6 19 6 19L6 11Z"></path>
        <path d="M20.1579 37C20.1579 37 20.2572 29.9255 17 26C13.956 22.3315 6 19 6 19"></path>
        <path d="M27.8421 37C27.8421 37 27.7428 29.9254 31 26C34.044 22.3315 42 19 42 19"></path>
      </g>
    </svg>
  );
}

function PoopIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...defaultProps}
      {...props}
    >
      <path
        fill={defaultProps.color}
        d="M11.36 2c-.21 0-.49.12-.79.32C10 2.7 8.85 3.9 8.4 5.1c-.34.9-.35 1.72-.21 2.33c-.56.1-.97.28-1.13.35c-.51.22-1.59 1.18-1.69 2.67c-.03.52.04 1.05.2 1.55c-.66.19-1.04.43-1.07.44c-.32.12-.85.49-1 .69c-.35.4-.58.87-.71 1.37c-.29 1.09-.19 2.33.34 3.33c.29.56.69 1.17 1.13 1.6c1.44 1.48 3.92 2.04 5.88 2.36c2.39.4 4.89.26 7.12-.66c3.35-1.39 4.24-3.63 4.38-4.24c.29-1.39-.07-2.7-.22-3.02c-.22-.46-.58-.93-1.17-1.23c-.4-.25-.75-.38-1.01-.44c.26-.95-.11-1.7-.62-2.26c-.77-.82-1.56-.94-1.56-.94c.26-.5.36-1.1.22-1.68c-.16-.71-.55-1.16-1.06-1.46c-.52-.31-1.16-.46-1.82-.58c-.32-.06-1.65-.25-2.2-1.01c-.45-.62-.46-1.74-.58-2.07c-.05-.13-.12-.2-.26-.2M16 9.61c.07 0 .13.01.19.01c1.43.16 2.45 1.54 2.28 3.07c-.17 1.53-1.47 2.65-2.9 2.49c-1.43-.18-2.45-1.53-2.28-3.07c.16-1.45 1.35-2.55 2.71-2.5m-7.38 0c1.33.04 2.44 1.17 2.54 2.6c.12 1.54-.95 2.87-2.38 2.98h-.01c-1.43.11-2.69-1.05-2.81-2.59c-.11-1.54.96-2.87 2.39-2.98c.09-.01.18-.01.27-.01m.02 1.7c-.04 0-.07 0-.11.01c-.56.07-.96.58-.89 1.13a1 1 0 0 0 1.13.87c.56-.07.96-.58.9-1.13a1.01 1.01 0 0 0-1.03-.88m7.3.02c-.52.02-.94.42-.98.95a1 1 0 0 0 .95 1.06a1.008 1.008 0 1 0 .14-2.01zm-7.23 4.82c.29-.01.55.08.79.13c1.18.22 2.2.25 2.69.25c.49 0 1.5-.03 2.67-.25c.41-.08.88-.25 1.25 0c.48.32.13 1.47-.61 2.25a4.53 4.53 0 0 1-3.31 1.38c-1.78 0-2.86-.91-3.31-1.38c-.74-.78-1.09-1.93-.62-2.25c.14-.09.29-.13.45-.13"
      ></path>
    </svg>
  );
}

function BathIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
      {...defaultProps}
      {...props}
    >
      <path
        fill="none"
        stroke={defaultProps.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6.5a4 4 0 0 1 8 0Zm2 3v1m-1.5 2v1m3.5-1v1m3.5-1v1M9 9.5v1m-2-8v-2"
      ></path>
    </svg>
  );
}

function FoodIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...defaultProps}
      {...props}
    >
      <path
        fill={defaultProps.color}
        d="M7 4.5c-.3 0-.5.3-.5.5v2.5h-1V5c0-.3-.2-.5-.5-.5s-.5.3-.5.5v2.5h-1V5c0-.3-.2-.5-.5-.5s-.5.3-.5.5v3.3c0 .9.7 1.6 1.5 1.7v7c0 .6.4 1 1 1s1-.4 1-1v-7c.8-.1 1.5-.8 1.5-1.7V5c0-.2-.2-.5-.5-.5M9 5v6h1v6c0 .6.4 1 1 1s1-.4 1-1V2c-1.7 0-3 1.3-3 3m7-1c-1.4 0-2.5 1.5-2.5 3.3c-.1 1.2.5 2.3 1.5 3V17c0 .6.4 1 1 1s1-.4 1-1v-6.7c1-.7 1.6-1.8 1.5-3C18.5 5.5 17.4 4 16 4"
      ></path>
    </svg>
  );
}

function SleepIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...defaultProps}
      {...props}
    >
      <g
        fill="none"
        stroke={defaultProps.color}
        strokeLinejoin="round"
        strokeWidth="4"
      >
        <path
          fill={defaultProps.color}
          d="M16.866 7.47A17.986 17.986 0 0 0 16 13c0 9.941 8.059 18 18 18a17.94 17.94 0 0 0 7.134-1.47C38.801 36.767 32.012 42 24 42c-9.941 0-18-8.059-18-18c0-7.407 4.473-13.768 10.866-16.53Z"
        ></path>
        <path strokeLinecap="round" d="M31.66 10H41l-10 8h10"></path>
      </g>
    </svg>
  );
}

function HygienIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...defaultProps}
      {...props}
    >
      <path
        fill={defaultProps.color}
        d="m17.86 1.5l-4.95 4.93l2.12 2.12l1.06-1.05l-1.06-1.07l2.83-2.83l1.06 1.06L20 3.6m1.4 0l-5.84 5.84l-2.13.71L3 20.57L4.43 22l5.65-5.67l4.25 4.24l4.24-4.24l-4.24-4.24l.17-.19l2.13-.71l4.77-4.76c.78-.78.78-2.05 0-2.83m-14.85.71L2.31 8.55l4.95 4.95l4.24-4.24m6.72 8.84l-2.13 2.12l1.41 1.41l2.13-2.13Z"
      ></path>
    </svg>
  );
}

function HealthCheckIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 384 384"
      xmlns="http://www.w3.org/2000/svg"
      {...defaultProps}
      {...props}
    >
      <path
        fill={defaultProps.color}
        d="M341 0q18 0 30.5 12.5T384 43v298q0 18-12.5 30.5T341 384H43q-18 0-30.5-12.5T0 341V43q0-18 12.5-30.5T43 0zm-21 235v-86h-85V64h-86v85H64v86h85v85h86v-85z"
      ></path>
    </svg>
  );
}

function OtherIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...defaultProps}
      {...props}
    >
      <path
        fill={defaultProps.color}
        d="M5.933.87a2.89 2.89 0 0 1 4.134 0l.622.638l.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89l.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622l.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01l-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637l-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89l-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622l-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01zM7.002 11a1 1 0 1 0 2 0a1 1 0 0 0-2 0m1.602-2.027c.04-.534.198-.815.846-1.26c.674-.475 1.05-1.09 1.05-1.986c0-1.325-.92-2.227-2.262-2.227c-1.02 0-1.792.492-2.1 1.29A1.71 1.71 0 0 0 6 5.48c0 .393.203.64.545.64c.272 0 .455-.147.564-.51c.158-.592.525-.915 1.074-.915c.61 0 1.03.446 1.03 1.084c0 .563-.208.885-.822 1.325c-.619.433-.926.914-.926 1.64v.111c0 .428.208.745.585.745c.336 0 .504-.24.554-.627"
      ></path>
    </svg>
  );
}

const defaultProps = {
  width: "1.2em",
  height: "1.2em",
  color: "#fff",
};

interface IconProps {
  width?: string;
  height?: string;
}
