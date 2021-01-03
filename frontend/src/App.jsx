import React from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { RecoilRoot } from "recoil";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import References from "./pages/References";
import Authors from "./pages/Authors";
import Magazines from "./pages/Magazines";
import Issues from "./pages/Issues";
import Tags from "./pages/Tags";

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

const App = () => (
  <ReactQueryCacheProvider queryCache={queryCache}>
    <ToastProvider autoDismissTimeout={4000} autoDismiss>
      <RecoilRoot>
        <Router>
          <Helmet titleTemplate="ISMDB - %s">
            <title>Home</title>
          </Helmet>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route path="/references" component={References} />
            <Route path="/authors" component={Authors} />
            <Route path="/magazines" component={Magazines} />
            <Route path="/issues" component={Issues} />
            <Route path="/tags" component={Tags} />
          </Switch>
        </Router>
      </RecoilRoot>
    </ToastProvider>
  </ReactQueryCacheProvider>
);

export default App;
