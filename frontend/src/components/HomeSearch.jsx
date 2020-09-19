import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

import Header from "./Header";

const HomeSearch = ({ title, copy, link, component: C, ...rest }) => (
  <Card>
    <Card.Body>
      <Card.Text className="mb-0" style={{ textAlign: "center" }}>
        Search in
      </Card.Text>
      <Card.Title className="text-center">
        <Link to={{ pathname: link }}>
          <Header>{title}</Header>
        </Link>
      </Card.Title>
      {copy && <Card.Text>{copy}</Card.Text>}
      {C && (
        <Card.Text>
          <C {...rest} />
        </Card.Text>
      )}
    </Card.Body>
  </Card>
);

export default HomeSearch;
