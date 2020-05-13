import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import setupCRUDHandler from "../utils/crud";
import Header from "../components/Header";
import AuthorForm from "../forms/AuthorForm";
import Notifications from "../components/Notifications";

const AuthorCreate = () => {
  const [{ notifications, authorCreated }, setState] = useState({
    notifications: [],
    authorCreated: false,
  });

  const crudHandler = setupCRUDHandler({
    type: "author",
    onSuccess: (data) => {
      let author = { ...data.author };
      let notes;

      if (data.notifications) {
        notes = data.notifications;
      } else {
        notes = [];
      }
      notes.push({
        status: "success",
        result: "Creation success",
        resultMessage: `Author "${author.name}" successfully created`,
      });

      setState({ notifications: notes, authorCreated: true });
    },
    onError: (error) => {
      const notes = [
        {
          status: "error",
          result: "Create error",
          resultMessage: `Error during creation: ${error.message}`,
        },
      ];
      setState({ authorCreated: false, notifications: notes });
    },
  });

  const submitHandler = (values, formikBag) => {
    crudHandler(values, formikBag);
    formikBag.setSubmitting(false);
  };

  if (authorCreated) {
    return (
      <Redirect
        push
        to={{ pathname: "/authors", notifications: notifications }}
      />
    );
  } else {
    return (
      <>
        <Helmet>
          <title>Add an Author</title>
        </Helmet>
        <Notifications notifications={notifications} />
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
