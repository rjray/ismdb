import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

import Header from "./Header";

const HomeSearch = ({ title, link, component: C, ...rest }) => (
  <Card>
    <Card.Body className="text-center">
      <Card.Text className="mb-0">Search in</Card.Text>
      <Card.Title>
        <Link to={{ pathname: `${link}/search` }}>
          <Header>{title}</Header>
        </Link>
      </Card.Title>
      <Card.Text>
        <Link to={{ pathname: `${link}/create` }}>
          Create new {title.toLowerCase()}
        </Link>
      </Card.Text>
      <div className="mt-5">{C && <C {...rest} />}</div>
    </Card.Body>
  </Card>
);

HomeSearch.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  component: PropTypes.elementType.isRequired,
};

export default HomeSearch;
