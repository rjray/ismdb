import React from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Container from "react-bootstrap/Container";

import NavHeader from "./NavHeader";
import Authors from "./Authors";
import Magazines from "./Magazines";
import References from "./References";

const App = () => (
  <Router>
    <Helmet titleTemplate="MyMoDB - %s">
      <title>Home</title>
    </Helmet>

    <NavHeader />

    <Container fluid>
      <Switch>
        <Route exact path="/">
          <Container>
            <h1>Home</h1>
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
);

export default App;
