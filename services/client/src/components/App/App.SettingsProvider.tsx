import { useAsync } from "@/shared/useAsync";
import type { ActivityLatestDetailsDTO, ChildDTO } from "baby-log-api";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";

const SettingsContext = createContext<
  | {
      children: ChildDTO[];
      selectedChild: ChildDTO | undefined;
      latestActivityDetails: ActivityLatestDetailsDTO | undefined;
    }
  | undefined
>(undefined);

export const SettingsProvider = (props: PropsWithChildren) => {
  const { data = [], status, executeAsync } = useAsync<ChildDTO[]>();

  const {
    data: latestActivityDetails,
    executeAsync: executeAsyncLatestActivityDetails,
  } = useAsync<ActivityLatestDetailsDTO>();

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

  const selectedChild = data[0];

  useEffect(
    function fetchLatestActivityDetails() {
      if (!selectedChild?.id) {
        return undefined;
      }

      executeAsyncLatestActivityDetails(async function doFetch() {
        const response = await fetch(
          `/api/activities/${selectedChild.id}/latest-details`
        );

        if (!response.ok) {
          throw new Error("could not fetch latest details");
        }

        const data: ActivityLatestDetailsDTO = await response.json();
        return data;
      });
    },
    [executeAsyncLatestActivityDetails, selectedChild?.id]
  );

  return (
    <SettingsContext.Provider
      value={{
        children: data,
        selectedChild,
        latestActivityDetails,
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
