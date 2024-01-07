import { useRouter } from "next/router";
import styles from "./App.module.css";
import { useSession } from "./App.SessionProvider";

export const TabBar = () => {
  const { session } = useSession();
  const router = useRouter();

  return {
    registered: (
      <footer className={styles.tabBar}>
        {routes.map(({ text, path, pathname }) => (
          <div
            onClick={() => router.push(path)}
            key={text}
            className={`${styles.tabBarItem} ${
              router.pathname === pathname ? styles.tabBarItemActive : ""
            }`}
          >
            {text}
          </div>
        ))}
      </footer>
    ),
    anonymous: null,
  }[session.type];
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
