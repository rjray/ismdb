import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";

import NavHeader from "../../components/NavHeader";
import ShowAuthor from "./ShowAuthor";
import UpdateAuthor from "./UpdateAuthor";
import ListAuthors from "./ListAuthors";

const Authors = () => {
  const match = useRouteMatch();

  return (
    <>
      <NavHeader />
      <Container>
        <Switch>
          <Route
            path={`${match.path}/:authorId(\\d+)`}
            component={ShowAuthor}
          />
          <Route
            path={`${match.path}/update/:authorId(\\d+)`}
            component={UpdateAuthor}
          />
          <Route path={match.path} component={ListAuthors} />
        </Switch>
      </Container>
    </>
  );
};

export default Authors;
