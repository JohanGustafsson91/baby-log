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

    const currentPage = router.pathname;

    const redirectToUrl = Object.values(pageGuardsMap)
      .map((guard) => guard({ userType: session.type, currentPage }))
      .find(Boolean);

    useEffect(
      function handleProtectRoute() {
        if (redirectToUrl) {
          router.push(redirectToUrl);
        }
      },
      [redirectToUrl, router]
    );

    return !redirectToUrl ? (
      <WrappedComponent {...props} />
    ) : (
      <div className="content" />
    );
  };

  return WithProtectedRoute;
};

const pageGuardsMap: Record<string, PageGuard> = {
  notAuthorizedForPage: ({ userType, currentPage }) =>
    userType === "anonymous" && currentPage !== "/login" ? "/login" : undefined,
  authorizedUserOnLoginPage: ({ userType, currentPage }) =>
    userType === "registered" && currentPage === "/login"
      ? "/today"
      : undefined,
};

type PageGuard = (arg: {
  userType: "registered" | "anonymous";
  currentPage: string;
}) => string | undefined;
