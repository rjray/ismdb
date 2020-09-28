import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { QueryCache, ReactQueryCacheProvider } from "react-query";

import AppContext from "./contexts/AppContext";
import NavHeader from "./components/NavHeader";
import Home from "./pages/Home";
import References from "./pages/References";
import Authors from "./pages/Authors";
import Magazines from "./pages/Magazines";
import Issues from "./pages/Issues";
import Tags from "./pages/Tags";

const queryCache = new QueryCache();

const App = () => {
  const [multientry, setMultientry] = useState(false);
  const toggleMultientry = () => setMultientry((multientry) => !multientry);

  const contextData = useMemo(
    () => ({
      multientry,
      toggleMultientry,
    }),
    [multientry]
  );

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ToastProvider autoDismissTimeout={3000}>
        <AppContext.Provider value={contextData}>
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
        </AppContext.Provider>
      </ToastProvider>
    </ReactQueryCacheProvider>
  );
};

export default App;
