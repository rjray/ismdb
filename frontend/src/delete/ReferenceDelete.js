import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";

import setupCRUDHandler from "../utils/crud";
import Header from "../components/Header";

const ReferenceDelete = (props) => {
  const reference = props.location.state.reference;
  const [{ notifications, referenceDeleted }, setState] = useState({
    notifications: [],
    referenceDeleted: false,
  });

  const crudHandler = setupCRUDHandler({
    type: "reference",
    onSuccess: (data) => {
      const notes = data.notifications || notifications || [];

      notes.push({
        status: "success",
        result: "Deletion success",
        resultMessage: `Reference "${reference.name}" successfully deleted`,
      });
      setState({ referenceDeleted: true, notifications: notes });
    },
    onError: (error) => {
      const notes = [
        {
          status: "error",
          result: "Update error",
          resultMessage: `Error during deletion: ${error.message}`,
        },
      ];
      setState({ referenceDeleted: false, notifications: notes });
    },
  });

  const submitHandler = (values, formikBag) => {
    crudHandler(values, formikBag);
    formikBag.setSubmitting(false);
  };

  if (referenceDeleted) {
    return (
      <Redirect to={{
        pathname: "/references",
        state: { notifications }
      }} />
    );
  } else {
    const num = reference.authors.length;
    const word1 = num === 1 ? "author's" : "authors'";
    const word2 = num === 1 ? "list" : "lists";

    return (
      <>
        <Helmet>
          <title>Delete Reference</title>
        </Helmet>
        <Container className="mt-2">
          <Row>
            <Col xs={12}>
              <Header>Delete reference "{reference.name}"?</Header>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12}>
              <p>
                This will remove {reference.name} from {num} {word1} {word2}.
              </p>
            </Col>
          </Row>
          <Formik
            initialValues={{ action: "delete", id: reference.id }}
            onSubmit={submitHandler}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form>
                <Form.Group as={Form.Row} className="mt-3">
                  <Col xs={6} className="text-right">
                    <LinkContainer to="/references/">
                      <Button>Cancel</Button>
                    </LinkContainer>
                  </Col>
                  <Col xs={6}>
                    <Button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      Delete
                    </Button>
                  </Col>
                </Form.Group>
              </Form>
            )}
          </Formik>
        </Container>
      </>
    );
  }
};

export default ReferenceDelete;
