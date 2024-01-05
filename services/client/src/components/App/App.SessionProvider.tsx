import type { UserDTO } from "baby-log-api";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SessionContext = createContext<
  | {
      session: Session;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | undefined>(undefined);

  useEffect(
    () => interceptFetch({ onUnathorized: () => setSession(anonymousSession) }),
    []
  );

  const fetchSessionMemoized = useCallback(async function fetchSession() {
    try {
      const response = await fetch(`/api/user`);

      if (!response.ok) {
        return setSession(anonymousSession);
      }

      if (response.ok) {
        const data: UserDTO = await response.json();
        return setSession({ ...data, type: "registered" });
      }
    } catch {
      return setSession(anonymousSession);
    }
  }, []);

  const deleteSessionMemoized = useCallback(
    async function deleteSession() {
      try {
        await fetch(`/api/login`, {
          method: "DELETE",
        });
        return fetchSessionMemoized();
      } catch {
        return fetchSessionMemoized();
      }
    },
    [fetchSessionMemoized]
  );

  useEffect(
    function validateSessionOnMount() {
      fetchSessionMemoized();
    },
    [fetchSessionMemoized]
  );

  return (
    <SessionContext.Provider
      value={{
        session: session ?? anonymousSession,
        logout: deleteSessionMemoized,
      }}
    >
      {session ? children : null}
    </SessionContext.Provider>
  );
};

export function useSession() {
  const ctx = useContext(SessionContext);

  if (!ctx) {
    throw new Error(
      "[useSession]: You must wrap your component with <SessionProvider />."
    );
  }

  return ctx;
}

function interceptFetch(config?: { onUnathorized: () => void }) {
  const { fetch: originalFetch } = globalThis;

  globalThis.fetch = async (...args) => {
    const [url, _config] = args;

    const init: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(_config?.headers ?? {}),
      },
      ...(_config ?? {}),
    };

    const response = await originalFetch(url as string, init);

    if (response.status === 401) {
      const refreshTokenResponse = await fetch("/api/login/refresh", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!refreshTokenResponse.ok) {
        config?.onUnathorized();
        return response;
      }

      return originalFetch(url as string, init);
    }

    return response;
  };
}

type Session = RegisteredSession | AnonymousSession;

interface RegisteredSession extends UserDTO {
  type: "registered";
}

interface AnonymousSession extends UserDTO {
  type: "anonymous";
}

const anonymousSession: AnonymousSession = {
  type: "anonymous",
  id: 0,
  name: "",
  email: "",
  pictureUrl: "",
  givenName: "",
  familyName: "",
  createdAt: new Date(),
};
