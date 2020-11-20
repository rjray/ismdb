import React from "react";
import { Link, useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import Header from "../../components/Header";
import FormatDate from "../../components/FormatDate";
import FormatAuthors from "../../components/FormatAuthors";
import FormatTags from "../../components/FormatTags";
import { getReferenceById } from "../../utils/queries";

const ShowReference = () => {
  const { referenceId } = useParams();
  const { isLoading, error, data } = useQuery(
    ["reference", referenceId],
    getReferenceById
  );

  if (isLoading) {
    return (
      <div className="text-center">
        <ScaleLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <strong>Error: {error.message}</strong>
      </div>
    );
  }

  const { reference } = data;
  let source;
  if (reference.RecordType.name === "book") {
    source = reference.isbn ? `ISBN ${reference.isbn}` : "Book";
  } else if (reference.RecordType.name === "article") {
    source = (
      <Link to={`/issues/${reference.MagazineIssue.id}`}>
        {`${reference.Magazine.name} ${reference.MagazineIssue.number}`}
      </Link>
    );
  } else if (reference.RecordType.name === "placeholder") {
    source = (
      <Link to={`/issues/${reference.MagazineIssue.id}`}>
        {`${reference.Magazine.name} ${reference.MagazineIssue.number} (placeholder)`}
      </Link>
    );
  } else {
    source = reference.RecordType.description;
  }

  return (
    <>
      <Helmet>
        <title>{reference.name}</title>
      </Helmet>
      <Row className="my-3">
        <Col xs={9}>
          <Header>{reference.name}</Header>
        </Col>
        <Col className="text-right" xs={3}>
          <LinkContainer to={`/references/update/${reference.id}`}>
            <Button>Edit</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Source:</strong>
        </Col>
        <Col>{source}</Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Type/Series:</strong>
        </Col>
        <Col>{reference.type}</Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>
            {reference.authors.length === 1 ? "Author: " : "Authors: "}
          </strong>
        </Col>
        <Col>
          {reference.authors.length ? (
            <FormatAuthors authors={reference.authors} />
          ) : (
            "none"
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Language:</strong>
        </Col>
        <Col>{reference.language || "English"}</Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Tags:</strong>
        </Col>
        <Col>
          <FormatTags tags={reference.tags} />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Added:</strong>
        </Col>
        <Col>
          <FormatDate date={reference.createdAt} />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Updated:</strong>
        </Col>
        <Col>
          <FormatDate date={reference.updatedAt} />
        </Col>
      </Row>
    </>
  );
};

export default ShowReference;
