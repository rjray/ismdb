import React from "react";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import Header from "../../components/Header";
import FormatDate from "../../components/FormatDate";
import FormatAuthorAliases from "../../components/FormatAuthorAliases";
import ReferenceTable from "../../components/ReferenceTable";
import { getAuthorByIdWithReferences } from "../../utils/queries";

const ShowAuthor = () => {
  const { authorId } = useParams();

  const { isLoading, error, data } = useQuery(
    ["author", authorId, { withRefsAndAliases: true }],
    getAuthorByIdWithReferences
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

  const { author } = data;

  return (
    <>
      <Helmet>
        <title>Author: {author.name}</title>
      </Helmet>
      <Row className="my-3">
        <Col xs={9}>
          <Header>Author: {author.name}</Header>
        </Col>
        <Col className="text-right" xs={3}>
          <LinkContainer to={`/authors/update/${author.id}`}>
            <Button>Edit</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Added:</strong>
        </Col>
        <Col>
          <FormatDate date={author.createdAt} />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Updated:</strong>
        </Col>
        <Col>
          <FormatDate date={author.updatedAt} />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>
            {author.aliases.length === 1 ? "Alias: " : "Aliases: "}
          </strong>
        </Col>
        <Col>
          {author.aliases.length ? (
            <FormatAuthorAliases aliases={author.aliases} />
          ) : (
            "none"
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <ReferenceTable
            title={`References (${author.references.length})`}
            currentAuthor={author.id}
            data={author.references}
          />
        </Col>
      </Row>
    </>
  );
};

export default ShowAuthor;
