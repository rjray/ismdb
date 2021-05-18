import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

import { useAuth } from "./auth";
import Home from "./pages/Home";
import References from "./pages/References";
import Authors from "./pages/Authors";
import Magazines from "./pages/Magazines";
import Issues from "./pages/Issues";
import Tags from "./pages/Tags";

const AuthenticatedApp = () => {
  const { logout } = useAuth();
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 24 * 60 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
            retry: false,
            onError: (error) => {
              if (error.response?.status === 401) {
                logout();
              } else {
                throw error;
              }
            },
          },
        },
      }),
    [logout]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider autoDismissTimeout={4000} autoDismiss>
        <RecoilRoot>
          <Router>
            <Helmet titleTemplate="ISMDB - %s">
              <title>Home</title>
            </Helmet>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/references" component={References} />
              <Route path="/authors" component={Authors} />
              <Route path="/magazines" component={Magazines} />
              <Route path="/issues" component={Issues} />
              <Route path="/tags" component={Tags} />
            </Switch>
          </Router>
        </RecoilRoot>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default AuthenticatedApp;
