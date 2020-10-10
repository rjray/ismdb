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
import ReferenceForm from "../../forms/ReferenceForm";

const ReferenceUpdate = () => {
  const { referenceId } = useParams();

  const url = `${apiEndpoint}/api/references/${referenceId}`;

  const { isLoading, error, data } = useQuery(
    ["reference", referenceId],
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

  const reference = { ...data.reference };

  reference.authors = reference.authors.map((item) => {
    return { ...item, deleted: false };
  });
  reference.createdAt = new Date(reference.createdAt);
  reference.updatedAt = new Date(reference.updatedAt);
  reference.MagazineId = reference.Magazine ? reference.Magazine.id : "";
  reference.MagazineIssueNumber = reference.MagazineIssue
    ? reference.MagazineIssue.number
    : "";
  delete reference.Magazine;
  delete reference.MagazineIssue;
  delete reference.RecordType;
  // Force this to a string:
  reference.RecordTypeId = String(reference.RecordTypeId);

  const submitHandler = (values, formikBag) => {
    alert(JSON.stringify(values, null, 2));
    formikBag.setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Reference Update</title>
      </Helmet>
      <Container className="mt-2">
        <Row>
          <Col>
            <Header>Reference Update</Header>
          </Col>
          <Col className="text-right">
            <LinkContainer
              to={{
                pathname: `/references/delete/${reference.id}`,
                state: { reference },
              }}
            >
              <Button>Delete</Button>
            </LinkContainer>
          </Col>
        </Row>
        <ReferenceForm reference={reference} submitHandler={submitHandler} />
      </Container>
    </>
  );
};

export default ReferenceUpdate;
