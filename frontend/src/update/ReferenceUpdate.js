import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useToasts } from "react-toast-notifications";

import useDataApi from "../utils/data-api";
import setupCRUDHandler from "../utils/crud";
import Header from "../components/Header";
import ReferenceForm from "../forms/ReferenceForm";

const crudHandler = setupCRUDHandler({
  type: "reference",
  onSuccess: (data, formikBag) => {
    let reference = { ...data.reference };
    reference.createdAt = new Date(reference.createdAt);
    reference.updatedAt = new Date(reference.updatedAt);
    for (let field in reference) {
      formikBag.setFieldValue(field, reference[field], false);
    }
  },
  onError: (error, formikBag) => {
    alert(`Error during reference update: ${error.message}`);
    formikBag.resetForm();
  },
});

const ReferenceUpdate = (props) => {
  let id = props.match.params.id;

  const { addToast } = useToasts();
  const [{ data, loading, error }] = useDataApi(
    `/api/views/combo/editreference/${id}`,
    {
      data: {},
    }
  );
  let content;

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load the reference:</p>
        <p>{error.message}</p>
      </>
    );
  } else if (loading) {
    content = (
      <div style={{ textAlign: "center" }}>
        <ScaleLoader />
      </div>
    );
  } else {
    const { reference } = data;

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
    reference.RecordTypeId = `${reference.RecordTypeId}`;

    const submitHandler = (values, formikBag) => {
      crudHandler(values, formikBag);
      formikBag.setSubmitting(false);
    };

    content = (
      <>
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
        <ReferenceForm
          {...data}
          action="update"
          submitHandler={submitHandler}
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reference Update</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  );
};

export default ReferenceUpdate;
