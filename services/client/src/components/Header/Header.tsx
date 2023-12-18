import { PropsWithChildren } from "react";
import styles from "./Header.module.css";

export const Header = ({ title, children }: PropsWithChildren<Props>) => {
  return (
    <header className={styles.header}>
      <h1>{title}</h1>
      {children}
    </header>
  );
};

interface Props {
  title: string;
}
