import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import CardDeck from "react-bootstrap/CardDeck";

import HomeSearch from "./components/HomeSearch";
import TopTags from "./components/TopTags";
import TopMagazines from "./components/TopMagazines";
import TopAuthors from "./components/TopAuthors";

const Home = () => (
  <Container fluid>
    <Row className="mb-3">
      <Col className="text-center" xs={12}>
        <h1>My Modeling DB</h1>
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <CardDeck>
          <HomeSearch
            title="References"
            link="/references/search"
            component={TopTags}
          />
          <HomeSearch
            title="Magazines"
            link="/magazines/search"
            component={TopMagazines}
          />
          <HomeSearch
            title="Authors"
            link="/authors/search"
            component={TopAuthors}
          />
        </CardDeck>
      </Col>
    </Row>
    <Row className="mt-4">
      <Col xs={12} sm={3}></Col>
      <Col className="mx-auto" xs={12} sm={6}>
        <Form.Control
          className="mx-0 px=0"
          type="text"
          placeholder="Quick search by name"
        />
      </Col>
      <Col xs={12} sm={3}></Col>
    </Row>
  </Container>
);

export default Home;
