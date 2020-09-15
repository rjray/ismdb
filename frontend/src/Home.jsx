import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardDeck from "react-bootstrap/CardDeck";

import HomeSearch from "./components/HomeSearch";

const refsCopy = `Some text that should span at least two of the lines in
the panel div.`;
const magsCopy = ``;
const authorsCopy = ``;

const Home = () => (
  <Container fluid>
    <Row className="mb-3">
      <Col xs={12}>
        <h1 style={{ textAlign: "center" }}>My Modeling DB</h1>
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <CardDeck>
          <HomeSearch title="References" copy={refsCopy} />
          <HomeSearch title="Magazines" copy={magsCopy} />
          <HomeSearch title="Authors" copy={authorsCopy} />
        </CardDeck>
      </Col>
    </Row>
  </Container>
);

export default Home;
