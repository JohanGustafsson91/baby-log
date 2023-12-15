import Head from "next/head";
import { Inter } from "next/font/google";
import { withProtectedRoute } from "@/components/SessionProvider/withProtectedRoute";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  return (
    <>
      <Head>
        <title>Baby Log</title>
        <meta name="description" content="Baby log app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <h1>Baby Log</h1>
      </main>
    </>
  );
};

export default withProtectedRoute(Home);
