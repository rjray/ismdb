import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";

import NavHeader from "../../components/NavHeader";
import ShowMagazine from "./ShowMagazine";
import UpdateMagazine from "./UpdateMagazine";
import ListMagazines from "./ListMagazines";
import CreateMagazine from "./CreateMagazine";
import DeleteMagazine from "./DeleteMagazine";

const Magazines = () => {
  const match = useRouteMatch();

  return (
    <>
      <NavHeader />
      <Container>
        <Switch>
          <Route
            path={`${match.path}/:magazineId(\\d+)`}
            component={ShowMagazine}
          />
          <Route path={`${match.path}/create`} component={CreateMagazine} />
          <Route
            path={`${match.path}/update/:magazineId(\\d+)`}
            component={UpdateMagazine}
          />
          <Route
            path={`${match.path}/delete/:magazineId(\\d+)`}
            component={DeleteMagazine}
          />
          <Route path={match.path} component={ListMagazines} />
        </Switch>
      </Container>
    </>
  );
};

export default Magazines;
