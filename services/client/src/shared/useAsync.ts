import { useState, useCallback, useRef } from "react";

type AsyncFunction<T> = () => Promise<T>;

type AsyncStatus = "idle" | "pending" | "success" | "error";

interface AsyncState<T> {
  data: T | undefined;
  error: Error | undefined;
  status: AsyncStatus;
}

export const useAsync = <T>() => {
  const [state, setState] = useState<AsyncState<T>>({
    data: undefined,
    error: undefined,
    status: "idle",
  });

  const execute = useCallback(
    async (asyncFunction: AsyncFunction<T>) => {
      try {
        setState({ data: undefined, error: undefined, status: "pending" });
        const data = await asyncFunction();
        setState({ data, error: undefined, status: "success" });
      } catch (error) {
        setState({ data: undefined, error: error as Error, status: "error" });
      }
    },
    [setState]
  );

  const updateData = useRef((cb: (data: T | undefined) => T) =>
    setState((prev) => ({ ...prev, data: cb(prev.data) }))
  );

  return { ...state, execute, updateData: updateData.current };
};
