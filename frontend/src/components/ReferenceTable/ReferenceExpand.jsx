import React from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

const FormatAuthors = ({ authors }) => {
  let content;

  if (authors.length) {
    content = [authors.length === 1 ? "Author: " : "Authors: "];
    for (let author of authors) {
      content.push(
        <Link key={author.id} to={`/authors/${author.id}`}>
          {author.name}
        </Link>
      );
      content.push(", ");
    }
    content.pop();
  }

  return <div>{content}</div>;
};

const FormatTags = ({ thisTag, tags }) => {
  let content = [];

  tags.forEach((tag) => {
    content.push(
      <Link key={tag.id} to={`/tags/${tag.id}`}>
        <Badge variant={tag.name === thisTag ? "primary" : "secondary"}>
          {tag.name}
        </Badge>
      </Link>
    );
    content.push(" ");
  });
  content.pop();

  return <span>{content}</span>;
};

const ReferenceExpand = ({ currentTag, data: reference }) => (
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
        <FormatAuthors authors={reference.authors} />
      </Col>
    </Row>
    <Row>
      <Col>
        Tags: <FormatTags thisTag={currentTag} tags={reference.tags} />
      </Col>
    </Row>
  </Container>
);

export default ReferenceExpand;
