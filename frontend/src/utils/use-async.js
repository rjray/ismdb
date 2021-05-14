/*
  Shamelessly "borrowed" from Kent C. Dodds' "bookshelf" class repo.

  https://github.com/kentcdodds/bookshelf.git
 */

import { useRef, useCallback, useLayoutEffect, useReducer } from "react";

function useSafeDispatch(dispatch) {
  const mounted = useRef(false);
  useLayoutEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);
  return useCallback(
    (...args) => (mounted.current ? dispatch(...args) : undefined),
    [dispatch]
  );
}

const defaultInitialState = { status: "idle", data: null, error: null };
function useAsync(initialState) {
  const initialStateRef = useRef({
    ...defaultInitialState,
    ...initialState,
  });
  const [{ status, data, error }, setState] = useReducer(
    (s, a) => ({ ...s, ...a }),
    initialStateRef.current
  );

  const safeSetState = useSafeDispatch(setState);

  const setData = useCallback(
    (dataIn) => safeSetState({ data: dataIn, status: "resolved" }),
    [safeSetState]
  );
  const setError = useCallback(
    (errorIn) => safeSetState({ error: errorIn, status: "rejected" }),
    [safeSetState]
  );
  const reset = useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  );

  const run = useCallback(
    (promise) => {
      if (!promise || !promise.then) {
        throw new Error(
          "The argument passed to useAsync().run must be a promise."
        );
      }
      safeSetState({ status: "pending" });
      return promise.then(
        (dataIn) => {
          setData(dataIn);
          return dataIn;
        },
        (errorIn) => {
          setError(errorIn);
          return errorIn;
        }
      );
    },
    [safeSetState, setData, setError]
  );

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === "idle",
    isLoading: status === "pending",
    isError: status === "rejected",
    isSuccess: status === "resolved",

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}

export default useAsync;
