import {
  SessionProvider,
  useSession,
} from "@/components/SessionProvider/SessionProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Image from "next/image";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <div className="layout">
        <Menu />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

const Menu = () => {
  const { session, logout } = useSession();

  return {
    registered: (
      <div style={{ marginBottom: 20 }}>
        <Image
          src={session.pictureUrl ?? ""}
          alt="photo"
          width={50}
          height={50}
        />
        Welcome {session.name} <button onClick={logout}>Logout</button>
      </div>
    ),
    anonymous: null,
  }[session.type];
};
