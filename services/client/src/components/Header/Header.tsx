import { PropsWithChildren } from "react";
import styles from "./Header.module.css";

export const Header = ({
  title,
  children,
  icons,
}: PropsWithChildren<Props>) => (
  <header className={styles.header}>
    <div className={styles.main}>
      <h1>{title}</h1>
      {icons}
    </div>
    <div>{children}</div>
  </header>
);

interface Props {
  title: string;
  icons?: React.ReactElement;
}
