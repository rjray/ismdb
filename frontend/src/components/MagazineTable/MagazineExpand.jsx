import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import MagazineIssues from "./MagazineIssues";

const MagazineExpand = ({ data: magazine }) => (
  <Container fluid className="mt-2 mb-3">
    <Row>
      <Col>
        <LinkContainer to={`/magazines/${magazine.id}`}>
          <Button>View</Button>
        </LinkContainer>
        &nbsp;
        <LinkContainer to={`/magazines/update/${magazine.id}`}>
          <Button>Edit</Button>
        </LinkContainer>
      </Col>
    </Row>
    <Row>
      <Col xs={6} sm={4} md={2} xl={1} className="text-right">
        <strong>Language:</strong>
      </Col>
      <Col>{magazine.language || "English"}</Col>
    </Row>
    <Row>
      <Col xs={6} sm={4} md={2} xl={1} className="text-right">
        <strong>Aliases:</strong>
      </Col>
      <Col>{magazine.aliases || "none"}</Col>
    </Row>
    <Row>
      <Col xs={6} sm={4} md={2} xl={1} className="text-right">
        <strong>Notes:</strong>
      </Col>
      <Col>{magazine.notes || "none"}</Col>
    </Row>
    <Row>
      <Col xs={6} sm={4} md={2} xl={1} className="text-right">
        <strong>Issues:</strong>
      </Col>
      <Col>
        <MagazineIssues issues={magazine.issues} />
      </Col>
    </Row>
  </Container>
);

export default MagazineExpand;
