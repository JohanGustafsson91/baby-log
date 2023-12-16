import {
  SessionProvider,
  useSession,
} from "@/components/SessionProvider/SessionProvider";
import { SettingsProvider } from "@/components/SettingsProvider/SettingsProvider";
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

  return {
    registered: (
      <div className="menu flex-space-between">
        <Link href="/today">Welcome {session.name}</Link>
        <Link href="/settings">Settings</Link>
      </div>
    ),
    anonymous: null,
  }[session.type];
};
