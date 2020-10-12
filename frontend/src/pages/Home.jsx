import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardDeck from "react-bootstrap/CardDeck";

import NavHeader from "../components/NavHeader";
import HomeSearch from "../components/HomeSearch";
import TopReferences from "../components/TopReferences";
import TopTags from "../components/TopTags";
import TopMagazines from "../components/TopMagazines";
import TopAuthors from "../components/TopAuthors";
import QuickSearch from "../components/QuickSearch";
import TagField from "../components/TagField";

const Home = () => (
  <>
    <NavHeader />
    <Container>
      <Row className="mb-3">
        <Col className="text-center" xs={12}>
          <h1>Internet Scale Modeler's Database</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <CardDeck>
            <HomeSearch
              title="References"
              link="/references/search"
              component={TopReferences}
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
            <HomeSearch title="Tags" link="/tags/search" component={TopTags} />
          </CardDeck>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col
          className="mx-auto"
          xs={12}
          sm={{ offset: 1, span: 10 }}
          md={{ offset: 2, span: 8 }}
        >
          <QuickSearch />
        </Col>
      </Row>
      <Row>
        <Col
          className="mx-auto"
          xs={12}
          sm={{ offset: 1, span: 10 }}
          md={{ offset: 2, span: 8 }}
        >
          <TagField />
        </Col>
      </Row>
    </Container>
  </>
);

export default Home;
