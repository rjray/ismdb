import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";

import ShowTag from "./ShowTag";
import ListTags from "./ListTags";

const Tags = () => {
  const match = useRouteMatch();

  return (
    <Container>
      <Switch>
        <Route path={`${match.path}/:tagId(\\d+)`} component={ShowTag} />
        <Route path={match.path} component={ListTags} />
      </Switch>
    </Container>
  );
};

export default Tags;
