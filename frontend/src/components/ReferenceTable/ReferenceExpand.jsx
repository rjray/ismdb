import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import FormatAuthors from "../FormatAuthors";
import FormatTags from "../FormatTags";

const ReferenceExpand = ({ currentTag, currentAuthor, data: reference }) => (
  <Container fluid className="mt-2 mb-3">
    <Row className="mb-1">
      <Col>
        <LinkContainer to={`/references/${reference.id}`}>
          <Button>View</Button>
        </LinkContainer>
        &nbsp;
        <LinkContainer to={`/references/update/${reference.id}`}>
          <Button>Edit</Button>
        </LinkContainer>
      </Col>
      <Col>{reference.language && `Language: ${reference.language}`}</Col>
    </Row>
    <Row>
      <Col>Type: {reference.type}</Col>
    </Row>
    <Row>
      <Col>
        {reference.authors.length === 1 ? "Author: " : "Authors: "}
        <FormatAuthors
          currentAuthor={currentAuthor}
          authors={reference.authors}
        />
      </Col>
    </Row>
    <Row>
      <Col>
        Tags: <FormatTags currentTag={currentTag} tags={reference.tags} />
      </Col>
    </Row>
  </Container>
);

export default ReferenceExpand;
