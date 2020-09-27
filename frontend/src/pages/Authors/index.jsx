import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";

import ShowAuthor from "./ShowAuthor";
import ListAuthors from "./ListAuthors";

const Authors = () => {
  const match = useRouteMatch();

  return (
    <Container>
      <Switch>
        <Route path={`${match.path}/:authorId(\\d+)`} component={ShowAuthor} />
        <Route path={match.path} component={ListAuthors} />
      </Switch>
    </Container>
  );
};

export default Authors;
