import {
  SessionProvider,
  useSession,
} from "@/components/SessionProvider/SessionProvider";
import {
  SettingsProvider,
  useSettings,
} from "@/components/SettingsProvider/SettingsProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Baby Log</title>
        <meta name="description" content="Baby log app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SessionProvider>
        <SettingsProvider>
          <main className={`${inter.className} layout`}>
            <Menu />
            <Component {...pageProps} />
          </main>
        </SettingsProvider>
      </SessionProvider>
    </>
  );
}

const Menu = () => {
  const { session } = useSession();
  const { selectedChild } = useSettings();

  return {
    registered: (
      <div className="menu flex-space-between mb-8">
        <Link href="/today">Activities for {selectedChild?.name}</Link>
        <Link href="/settings">
          <ProfileIcon />
        </Link>
      </div>
    ),
    anonymous: null,
  }[session.type];
};

const ProfileIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M12 11a2 2 0 100 4 2 2 0 000-4z" />
      <path d="M22 21v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" />
    </svg>
  );
};
