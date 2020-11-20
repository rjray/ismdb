import React from "react";
import PropTypes from "prop-types";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import FormatTags from "../FormatTags";

const TagExpand = ({ data: tag }) => (
  <Container fluid className="mt-2 mb-3">
    <Row className="mb-1">
      <Col>
        <LinkContainer to={`/tags/${tag.id}`}>
          <Button>View</Button>
        </LinkContainer>
        &nbsp;
        <LinkContainer to={`/tags/update/${tag.id}`}>
          <Button>Edit</Button>
        </LinkContainer>
      </Col>
    </Row>
    <Row>
      <Col>
        Related Tags: {tag.refcount ? <FormatTags tags={[]} /> : <em>none</em>}
      </Col>
    </Row>
  </Container>
);

TagExpand.propTypes = {
  data: PropTypes.object.isRequired,
};

export default TagExpand;
