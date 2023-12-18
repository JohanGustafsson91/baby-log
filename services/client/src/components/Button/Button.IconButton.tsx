import React, { FC, MouseEvent } from "react";
import styles from "./Button.module.css"; // Import your CSS file for styling

interface Props {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  icon: "add";
}

export const IconButton: FC<Props> = ({ onClick, icon }) => {
  return (
    <button className={styles.iconButton} onClick={onClick}>
      {{ add: <AddIcon /> }[icon]}
    </button>
  );
};

const AddIcon = () => (
  <svg
    width="119px"
    height="119px"
    viewBox="-2.4 -2.4 28.80 28.80"
    xmlns="http://www.w3.org/2000/svg"
    fill="#e0e0e0"
    transform="matrix(-1, 0, 0, 1, 0, 0)"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#CCCCCC"
      strokeWidth="0.144"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <title></title>{" "}
      <g id="Complete">
        {" "}
        <g data-name="add" id="add-2">
          {" "}
          <g>
            {" "}
            <line
              fill="none"
              stroke="#e0e0e0"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.4"
              x1="12"
              x2="12"
              y1="19"
              y2="5"
            ></line>{" "}
            <line
              fill="none"
              stroke="#e0e0e0"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.4"
              x1="5"
              x2="19"
              y1="12"
              y2="12"
            ></line>{" "}
          </g>{" "}
        </g>{" "}
      </g>{" "}
    </g>
  </svg>
);
