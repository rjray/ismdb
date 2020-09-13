import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { ToastProvider } from "react-toast-notifications";

import AppContext from "./AppContext";
import NavHeader from "./NavHeader";
import Authors from "./Authors";
import Magazines from "./Magazines";
import References from "./References";
import Header from "./components/Header";

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

          <Container fluid>
            <Switch>
              <Route exact path="/">
                <Container>
                  <Header>Home</Header>
                </Container>
              </Route>
              <Route
                path="/references/:view(create|retrieve|update|delete)?/:id(\d+)?"
                component={References}
              />
              <Route
                path="/authors/:view(create|retrieve|update|delete)?/:id(\d+)?"
                component={Authors}
              />
              <Route
                path="/magazines/:view(create|retrieve|update|delete)?/:id(\d+)?/:iid(\d+)?"
                component={Magazines}
              />
            </Switch>
          </Container>
        </Router>
      </AppContext.Provider>
    </ToastProvider>
  );
};

export default App;
