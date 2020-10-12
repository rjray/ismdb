import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";

import NavHeader from "../../components/NavHeader";
import ShowIssue from "./ShowIssue";

const Issues = () => {
  const match = useRouteMatch();

  return (
    <>
      <NavHeader />
      <Container>
        <Switch>
          <Route path={`${match.path}/:issueId(\\d+)`} component={ShowIssue} />
        </Switch>
      </Container>
    </>
  );
};

export default Issues;
