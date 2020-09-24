import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

import Header from "./Header";

const HomeSearch = ({ title, copy, link, component: C, ...rest }) => (
  <Card>
    <Card.Body className="text-center">
      <Card.Text className="mb-0">Search in</Card.Text>
      <Card.Title>
        <Link to={{ pathname: link }}>
          <Header>{title}</Header>
        </Link>
      </Card.Title>
      {copy && <Card.Text>{copy}</Card.Text>}
      <div className="mt-5">{C && <C {...rest} />}</div>
    </Card.Body>
  </Card>
);

export default HomeSearch;
