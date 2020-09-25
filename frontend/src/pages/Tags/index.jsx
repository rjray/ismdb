import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";

import ShowTag from "./ShowTag";

const Tags = () => {
  const match = useRouteMatch();

  return (
    <Container fluid>
      <Switch>
        <Route path={`${match.path}/:tagId(\\d+)`} component={ShowTag} />
        <Route path={match.path}></Route>
      </Switch>
    </Container>
  );
};

export default Tags;
