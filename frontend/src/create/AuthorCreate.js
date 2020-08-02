import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useToasts } from "react-toast-notifications";

import setupCRUDHandler from "../utils/crud";
import Header from "../components/Header";
import AuthorForm from "../forms/AuthorForm";

const AuthorCreate = () => {
  const { addToast } = useToasts();
  const [authorCreated, setAuthorCreated] = useState(false);

  const crudHandler = setupCRUDHandler({
    type: "author",
    onSuccess: (data) => {
      const notifications = data.notifications;

      notifications.forEach((n) =>
        addToast(n.message, { appearance: n.status })
      );

      setAuthorCreated(true);
    },
    onError: ({ error }) => {
      if (Array.isArray(error)) {
        error.forEach((e) => addToast(e.message, { appearance: "error" }));
      } else {
        addToast(error.message, { appearance: "error" });
      }

      setAuthorCreated(false);
    },
  });

  const submitHandler = (values, formikBag) => {
    crudHandler(values, formikBag);
    formikBag.setSubmitting(false);
  };

  if (authorCreated) {
    return <Redirect push to={{ pathname: "/authors" }} />;
  } else {
    return (
      <>
        <Helmet>
          <title>Add an Author</title>
        </Helmet>
        <Container className="mt-2">
          <Row>
            <Col>
              <Header>Add an Author</Header>
            </Col>
          </Row>
          <AuthorForm
            submitHandler={submitHandler}
            action="create"
            author={{ name: "", notes: "", aliases: [] }}
          />
        </Container>
      </>
    );
  }
};

export default AuthorCreate;
