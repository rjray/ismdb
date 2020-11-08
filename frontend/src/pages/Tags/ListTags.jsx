import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import Header from "../../components/Header";
import TagTable from "../../components/TagTable";
import { getAllTagsWithRefCount } from "../../utils/queries";

const ListTags = () => {
  const { isLoading, error, data } = useQuery(
    ["tags", { withRefCount: true }],
    getAllTagsWithRefCount
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
        <title>All Tags</title>
      </Helmet>
      <Row className="my-3">
        <Col xs={9}>
          <Header>All Tags</Header>
        </Col>
        <Col className="text-right" xs={3}>
          <LinkContainer to="/tags/create">
            <Button>New Tag</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Row>
        <Col>
          <TagTable data={data.tags} />
        </Col>
      </Row>
    </>
  );
};

export default ListTags;
