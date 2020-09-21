import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { QueryCache, ReactQueryCacheProvider } from "react-query";

import AppContext from "./AppContext";
import NavHeader from "./NavHeader";
import Home from "./Home";

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
            <Helmet titleTemplate="MyMoDB - %s">
              <title>Home</title>
            </Helmet>

            <NavHeader />

            <Switch>
              <Route exact path="/" component={Home} />
            </Switch>
          </Router>
        </AppContext.Provider>
      </ToastProvider>
    </ReactQueryCacheProvider>
  );
};

export default App;
