import React, { FC, MouseEvent } from "react";
import styles from "./Button.module.css";

export const IconButton: FC<Props> = ({ onClick, icon, disabled = false }) => {
  return (
    <button className={styles.iconButton} onClick={onClick} disabled={disabled}>
      {
        {
          add: <AddIcon />,
          edit: <EditIcon />,
          delete: <DeleteIcon />,
          close: <CloseIcon />,
        }[icon]
      }
    </button>
  );
};

interface Props {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  icon: "add" | "edit" | "delete" | "close";
  disabled?: boolean;
}

// TODO move icons

const EditIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#3498db">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <title></title>{" "}
      <g id="Complete">
        {" "}
        <g id="edit">
          {" "}
          <g>
            {" "}
            <path
              d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
              fill="none"
              stroke="#3498db"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>{" "}
            <polygon
              fill="none"
              points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
              stroke="#3498db"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></polygon>{" "}
          </g>{" "}
        </g>{" "}
      </g>{" "}
    </g>
  </svg>
);

const AddIcon = () => (
  <svg
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
      stroke="#e0e0e0"
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

const DeleteIcon = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="#ff3333"
    stroke="#ff3333"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <title></title>{" "}
      <g id="Complete">
        {" "}
        <g id="x-square">
          {" "}
          <g>
            {" "}
            <rect
              data-name="--Rectangle"
              fill="none"
              height="20"
              id="_--Rectangle"
              rx="2"
              ry="2"
              stroke="#ff3333"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              width="20"
              x="2"
              y="2"
            ></rect>{" "}
            <line
              fill="none"
              stroke="#ff3333"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="14.5"
              x2="9.5"
              y1="9.5"
              y2="14.5"
            ></line>{" "}
            <line
              fill="none"
              stroke="#ff3333"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="14.5"
              x2="9.5"
              y1="14.5"
              y2="9.5"
            ></line>{" "}
          </g>{" "}
        </g>{" "}
      </g>{" "}
    </g>
  </svg>
);

const CloseIcon = () => (
  <svg
    width="64px"
    height="64px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="#e0e0e0"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <title></title>{" "}
      <g id="Complete">
        {" "}
        <g id="x-circle">
          {" "}
          <g>
            {" "}
            <circle
              cx="12"
              cy="12"
              data-name="--Circle"
              fill="none"
              id="_--Circle"
              r="10"
              stroke="#e0e0e0"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></circle>{" "}
            <line
              fill="none"
              stroke="#e0e0e0"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="14.5"
              x2="9.5"
              y1="9.5"
              y2="14.5"
            ></line>{" "}
            <line
              fill="none"
              stroke="#e0e0e0"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="14.5"
              x2="9.5"
              y1="14.5"
              y2="9.5"
            ></line>{" "}
          </g>{" "}
        </g>{" "}
      </g>{" "}
    </g>
  </svg>
);
