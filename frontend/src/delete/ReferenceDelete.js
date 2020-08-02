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
import { useToasts } from "react-toast-notifications";

import setupCRUDHandler from "../utils/crud";
import Header from "../components/Header";

const ReferenceDelete = (props) => {
  const reference = props.location.state.reference;

  const { addToast } = useToasts();
  const [referenceDeleted, setReferenceDeleted] = useState(false);

  const crudHandler = setupCRUDHandler({
    type: "reference",
    onSuccess: ({ notifications }) => {
      notifications.forEach((n) =>
        addToast(n.message, { appearance: n.status })
      );
      setReferenceDeleted(true);
    },
    onError: ({ error }) => {
      if (Array.isArray(error)) {
        error.forEach((e) => addToast(e.message, { appearance: "error" }));
      } else {
        addToast(error.message, { appearance: "error" });
      }
      setReferenceDeleted(false);
    },
  });

  const submitHandler = (values, formikBag) => {
    crudHandler(values, formikBag);
    formikBag.setSubmitting(false);
  };

  if (referenceDeleted) {
    return <Redirect to={{ pathname: "/references" }} />;
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
