import React, { lazy, Suspense } from "react";

import FullPageSpinner from "./components/FullPageSpinner";
import { useAuth } from "./auth";

const AuthenticatedApp = lazy(() =>
  import(/* webpackPrefetch: true */ "./AuthenticatedApp")
);
const UnauthenticatedApp = lazy(() => import("./UnauthenticatedApp"));

const App = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </Suspense>
  );
};

export default App;
