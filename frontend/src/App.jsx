import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";

import AppContext from "./AppContext";
import NavHeader from "./NavHeader";
import Home from "./Home";

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
  );
};

export default App;
