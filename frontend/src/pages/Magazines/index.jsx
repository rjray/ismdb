import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";

import ShowMagazine from "./ShowMagazine";
import UpdateMagazine from "./UpdateMagazine";
import ListMagazines from "./ListMagazines";

const Magazines = () => {
  const match = useRouteMatch();

  return (
    <Container>
      <Switch>
        <Route
          path={`${match.path}/:magazineId(\\d+)`}
          component={ShowMagazine}
        />
        <Route
          path={`${match.path}/update/:magazineId(\\d+)`}
          component={UpdateMagazine}
        />
        <Route path={match.path} component={ListMagazines} />
      </Switch>
    </Container>
  );
};

export default Magazines;
