import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import styles from "./App.module.css";
import { TabBar } from "./App.TabBar";
import { SettingsProvider } from "./App.SettingsProvider";
import { SessionProvider } from "./App.SessionProvider";

const inter = Inter({ subsets: ["latin"] });

enableMocking();

export const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Baby Log</title>
        <meta name="description" content="Baby log app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SessionProvider>
        <SettingsProvider>
          <div className={`${inter.className} ${styles.layout}`}>
            <Component {...pageProps} />
            <TabBar />
          </div>
        </SettingsProvider>
      </SessionProvider>
    </>
  );
};

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { worker } = require("../../mocks/browser");

  return worker.start();
}
