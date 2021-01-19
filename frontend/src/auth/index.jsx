import React, { createContext, useContext } from "react";

import * as auth from "./provider";
import useAsync from "../utils/use-async";

const getUser = () => {};

const AuthContext = createContext();
AuthContext.displayName = "AuthContext";

const AuthProvider = (props) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
    status,
  } = useAsync();

  React.useEffect(() => {
    run(getUser());
  }, [run]);

  const login = (form) => auth.login(form).then((u) => setData(u));
  const register = (form) => auth.register(form).then((u) => setData(u));
  const logout = () => {
    auth.logout();
    setData(null);
  };

  if (isLoading || isIdle) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error: {error.message}</h1>;
  }

  if (isSuccess) {
    const value = { user, login, register, logout };
    return <AuthContext.Provider value={value} {...props} />;
  }

  throw new Error(`Unhandled status: ${status}`);
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
