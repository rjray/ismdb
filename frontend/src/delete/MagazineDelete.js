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

const MagazineDelete = (props) => {
  const magazine = props.location.state.magazine;

  const { addToast } = useToasts();
  const [magazineDeleted, setMagazineDelete] = useState(false);

  const crudHandler = setupCRUDHandler({
    type: "magazine",
    onSuccess: ({ notifications }) => {
      notifications.forEach((n) =>
        addToast(n.message, { appearance: n.status })
      );
      setMagazineDeleted(true);
    },
    onError: ({ error }) => {
      if (Array.isArray(error)) {
        error.forEach((e) => addToast(e.message, { appearance: "error" }));
      } else {
        addToast(error.message, { appearance: "error" });
      }
      setMagazineDeleted(false);
    },
  });

  const submitHandler = (values, formikBag) => {
    crudHandler(values, formikBag);
    formikBag.setSubmitting(false);
  };

  if (magazineDeleted) {
    return <Redirect to={{ pathname: "/magazines" }} />;
  } else {
    const num = magazine.readings.length;
    const wordform = num === 1 ? "reading" : "readings";

    return (
      <>
        <Helmet>
          <title>Delete Magazine</title>
        </Helmet>
        <Container className="mt-2">
          <Row>
            <Col xs={12}>
              <Header>Delete magazine "{magazine.name}"?</Header>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12}>
              <p>
                This will remove {magazine.name} from {num} {wordform}.
              </p>
            </Col>
          </Row>
          <Formik
            initialValues={{ action: "delete", id: magazine.id }}
            onSubmit={submitHandler}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form>
                <Form.Group as={Form.Row} className="mt-3">
                  <Col xs={6} className="text-right">
                    <LinkContainer to="/magazines/">
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

export default MagazineDelete;
