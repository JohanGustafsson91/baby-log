import { useAsync } from "@/shared/useAsync";
import type { ChildDTO } from "baby-log-api";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";

const SettingsContext = createContext<
  | {
      children: ChildDTO[];
      selectedChild: ChildDTO | undefined;
    }
  | undefined
>(undefined);

export const SettingsProvider = (props: PropsWithChildren) => {
  const {
    data = [],
    status,
    executeAsync: executeAsync,
  } = useAsync<ChildDTO[]>();

  useEffect(
    function fetchChildren() {
      executeAsync(async function doFetch() {
        const response = await fetch("/api/children");

        if (!response.ok) {
          throw new Error("could not fetch children");
        }

        const data: ChildDTO[] = await response.json();
        return data;
      });
    },
    [executeAsync]
  );

  return (
    <SettingsContext.Provider
      value={{
        children: data,
        selectedChild: data[0],
      }}
    >
      {!["idle", "pending"].includes(status) ? props.children : null}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const ctx = useContext(SettingsContext);

  if (!ctx) {
    throw new Error(
      "[useSettings]: You must wrap your component with <SettingsProvider />."
    );
  }

  return ctx;
}
