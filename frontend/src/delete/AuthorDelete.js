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

const AuthorDelete = (props) => {
  const author = props.location.state.author;
  const [{ notifications, authorDeleted }, setState] = useState({
    notifications: [],
    authorDeleted: false,
  });

  const crudHandler = setupCRUDHandler({
    type: "author",
    onSuccess: (data) => {
      const notes = data.notifications || notifications || [];

      notes.push({
        status: "success",
        result: "Deletion success",
        resultMessage: `Author "${author.name}" successfully deleted`,
      });
      setState({ authorDeleted: true, notifications: notes });
    },
    onError: (error) => {
      const notes = [
        {
          status: "error",
          result: "Update error",
          resultMessage: `Error during deletion: ${error.message}`,
        },
      ];
      setState({ authorDeleted: false, notifications: notes });
    },
  });

  const submitHandler = (values, formikBag) => {
    crudHandler(values, formikBag);
    formikBag.setSubmitting(false);
  };

  if (authorDeleted) {
    return (
      <Redirect to={{ pathname: "/authors", notifications: notifications }} />
    );
  } else {
    const num = author.references.length;
    const wordform = num === 1 ? "reference" : "references";

    return (
      <>
        <Helmet>
          <title>Delete Author</title>
        </Helmet>
        <Container className="mt-2">
          <Row>
            <Col xs={12}>
              <Header>Delete author "{author.name}"?</Header>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12}>
              <p>
                This will remove {author.name} from {num} {wordform}.
              </p>
            </Col>
          </Row>
          <Formik
            initialValues={{ action: "delete", id: author.id }}
            onSubmit={submitHandler}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form>
                <Form.Group as={Form.Row} className="mt-3">
                  <Col xs={6} className="text-right">
                    <LinkContainer to="/authors/">
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

export default AuthorDelete;
