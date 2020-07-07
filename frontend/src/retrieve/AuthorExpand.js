import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import AuthorAliases from "./AuthorAliases";

const AuthorExpand = (props) => {
  const author = props.data;

  return (
    <Container fluid className="mt-2 mb-3">
      <Row>
        <Col>
          <LinkContainer to={`/authors/${author.id}`}>
            <Button>View</Button>
          </LinkContainer>
          &nbsp;
          <LinkContainer to={`/authors/update/${author.id}`}>
            <Button>Edit</Button>
          </LinkContainer>
        </Col>
      </Row>
      {author.aliases.length > 0 && <AuthorAliases aliases={author.aliases} />}
    </Container>
  );
};

export default AuthorExpand;
