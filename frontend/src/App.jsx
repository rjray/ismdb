import React from "react";
import { useAuth } from "./auth";

// const AuthenticatedApp = React.lazy(() =>
//   import(/* webpackPrefetch: true */ "./AuthenticatedApp")
// );
// const UnauthenticatedApp = React.lazy(() => import("./UnauthenticatedApp"));
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";

const App = () => {
  const { user } = useAuth();

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default App;
