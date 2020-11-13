import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import Header from "../../components/Header";
import ReferenceTable from "../../components/ReferenceTable";
import { getAllReferences } from "../../utils/queries";

const ListReferences = () => {
  const { isLoading, error, data } = useQuery("references", getAllReferences);

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
        <title>All References</title>
      </Helmet>
      <Row className="my-3">
        <Col xs={9}>
          <Header>All References</Header>
        </Col>
        <Col className="text-right" xs={3}>
          <LinkContainer to="/references/create">
            <Button>New Reference</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Row>
        <Col>
          <ReferenceTable data={data.references} />
        </Col>
      </Row>
    </>
  );
};

export default ListReferences;
