import React from "react";
import Card from "react-bootstrap/Card";

import Header from "./Header";

const HomeSearch = ({ title, copy, component: C, ...rest }) => (
  <Card>
    <Card.Body>
      <Card.Text className="mb-0" style={{ textAlign: "center" }}>
        Search in
      </Card.Text>
      <Card.Title style={{ textAlign: "center" }}>
        <Header>{title}</Header>
      </Card.Title>
      <Card.Text>{copy}</Card.Text>
      {C && <C {...rest} />}
    </Card.Body>
  </Card>
);

export default HomeSearch;
