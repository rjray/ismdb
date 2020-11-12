import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import Header from "../../components/Header";
import MagazineTable from "../../components/MagazineTable";
import { getAllMagazinesWithIssues } from "../../utils/queries";

const ListMagazines = () => {
  const { isLoading, error, data } = useQuery(
    ["magazines", { withIssues: true }],
    getAllMagazinesWithIssues
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
        <title>All Magazines</title>
      </Helmet>
      <Row className="my-3">
        <Col xs={9}>
          <Header>All Magazines</Header>
        </Col>
        <Col className="text-right" xs={3}>
          <LinkContainer to="/magazines/create">
            <Button>New Magazine</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Row>
        <Col>
          <MagazineTable data={data.magazines} />
        </Col>
      </Row>
    </>
  );
};

export default ListMagazines;
