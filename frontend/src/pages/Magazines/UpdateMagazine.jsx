import React from "react";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../../utils/api-endpoint";
import Header from "../../components/Header";
import MagazineForm from "../../forms/MagazineForm";

const UpdateMagazine = () => {
  const { magazineId } = useParams();

  const url = `${apiEndpoint}/api/magazines/${magazineId}`;

  const { isLoading, error, data } = useQuery(["magazine", magazineId], () => {
    return fetch(url).then((res) => res.json());
  });

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

  const magazine = { ...data.magazine };

  const submitHandler = (values, formikBag) => {
    alert(JSON.stringify(values, null, 2));
    formikBag.setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Magazine Update</title>
      </Helmet>
      <Container className="mt-2">
        <Row>
          <Col>
            <Header>Magazine Update</Header>
          </Col>
          <Col className="text-right">
            <LinkContainer to={`/magazines/delete/${data.magazine.id}`}>
              <Button>Delete</Button>
            </LinkContainer>
          </Col>
        </Row>
        <MagazineForm magazine={magazine} submitHandler={submitHandler} />
      </Container>
    </>
  );
};

export default UpdateMagazine;
