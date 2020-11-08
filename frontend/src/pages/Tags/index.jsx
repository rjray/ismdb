import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";

import NavHeader from "../../components/NavHeader";
import ShowTag from "./ShowTag";
import UpdateTag from "./UpdateTag";
import ListTags from "./ListTags";
import CreateTag from "./CreateTag";
import DeleteTag from "./DeleteTag";

const Tags = () => {
  const match = useRouteMatch();

  return (
    <>
      <NavHeader />
      <Container>
        <Switch>
          <Route path={`${match.path}/:tagId(\\d+)`} component={ShowTag} />
          <Route path={`${match.path}/create`} component={CreateTag} />
          <Route
            path={`${match.path}/update/:tagId(\\d+)`}
            component={UpdateTag}
          />
          <Route
            path={`${match.path}/delete/:tagId(\\d+)`}
            component={DeleteTag}
          />
          <Route path={match.path} component={ListTags} />
        </Switch>
      </Container>
    </>
  );
};

export default Tags;
