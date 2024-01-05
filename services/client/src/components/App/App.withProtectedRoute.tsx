import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "./App.SessionProvider";

export const withProtectedRoute = <P extends object>(
  WrappedComponent: NextPage<P>
) => {
  const WithProtectedRoute: NextPage<P> = (props) => {
    const router = useRouter();
    const { session } = useSession();
    console.log(session);

    const currentPage = router.pathname;

    useEffect(
      function handleProtectRoute() {
        if (session.type === "anonymous" && currentPage !== "/login") {
          router.push("/login");
        }

        if (session.type === "registered" && currentPage === "/login") {
          console.log("heheh");
          router.push("/");
        }
      },
      [currentPage, router, session.type]
    );

    const shouldRender = [
      session.type === "registered" && currentPage !== "/login",
      session.type === "anonymous" && currentPage === "/login",
    ].some(Boolean);
    console.log(shouldRender, WrappedComponent);
    return shouldRender ? (
      <WrappedComponent {...props} />
    ) : (
      <div className="content" />
    );
  };

  return WithProtectedRoute;
};
