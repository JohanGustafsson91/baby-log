import { useRouter } from "next/router";
import styles from "./App.module.css";
import { useSession } from "./App.SessionProvider";

export const TabBar = () => {
  const { session } = useSession();
  const router = useRouter();

  function navigate(path: string) {
    router.push(path);
  }

  return session.type === "registered" ? (
    <footer className={styles.tabBar}>
      {routes.map(({ text, path, pathname }) => (
        <div
          onClick={() => navigate(path)}
          key={text}
          className={`${styles.tabBarItem} ${
            router.pathname === pathname ? styles.tabBarItemActive : ""
          }`}
        >
          {text}
        </div>
      ))}
    </footer>
  ) : null;
};

const routes = [
  {
    text: "Hem",
    path: `/today`,
    pathname: "/[...day]",
  },
  {
    text: "Inställningar",
    path: `/settings`,
    pathname: "/settings",
  },
];
