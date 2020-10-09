import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../../utils/api-endpoint";
import Header from "../../components/Header";
import AuthorTable from "../../components/AuthorTable";

const ListAuthors = () => {
  const url = `${apiEndpoint}/api/authors/withRefCount`;

  const { isLoading, error, data } = useQuery(
    "all authors with refcount",
    () => {
      return fetch(url).then((res) => res.json());
    }
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

  return (
    <>
      <Helmet>
        <title>All Authors</title>
      </Helmet>
      <Row className="my-3">
        <Col xs={9}>
          <Header>All Authors</Header>
        </Col>
        <Col className="text-right" xs={3}>
          <LinkContainer to="/authors/create">
            <Button>New Author</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Row>
        <Col>
          <AuthorTable data={data.authors} />
        </Col>
      </Row>
    </>
  );
};

export default ListAuthors;
