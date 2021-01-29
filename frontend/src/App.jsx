import React from "react";

import FullPageSpinner from "./components/FullPageSpinner";
import { useAuth } from "./auth";

const AuthenticatedApp = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./AuthenticatedApp")
);
const UnauthenticatedApp = React.lazy(() => import("./UnauthenticatedApp"));

const App = () => {
  const { user } = useAuth();

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  );
};

export default App;
