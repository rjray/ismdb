import React from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { RecoilRoot } from "recoil";

import NavHeader from "./components/NavHeader";
import Home from "./pages/Home";
import References from "./pages/References";
import Authors from "./pages/Authors";
import Magazines from "./pages/Magazines";
import Issues from "./pages/Issues";
import Tags from "./pages/Tags";

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      staleTime: Infinity,
      cacheTime: 24 * 60 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ToastProvider autoDismissTimeout={3000}>
        <RecoilRoot>
          <Router>
            <Helmet titleTemplate="ISMDB - %s">
              <title>Home</title>
            </Helmet>

            <NavHeader />

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
    </ReactQueryCacheProvider>
  );
};

export default App;
