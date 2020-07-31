import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import AppContext from "../AppContext";
import setupCRUDHandler from "../utils/crud";
import Header from "../components/Header";
import AuthorForm from "../forms/AuthorForm";
import Notifications from "../components/Notifications";

const AuthorCreate = () => {
  const { setNotifications } = useContext(AppContext);
  const [authorCreated, setAuthorCreated] = useState(false);

  const crudHandler = setupCRUDHandler({
    type: "author",
    onSuccess: (data) => {
      let author = { ...data.author };
      let notifications = data.notifications || [];

      notifications.push({
        status: "success",
        result: "Creation success",
        resultMessage: `Author "${author.name}" successfully created`,
      });

      setNotifications(notifications);
      setAuthorCreated(true);
    },
    onError: (error) => {
      const notifications = [
        {
          status: "error",
          result: "Create error",
          resultMessage: `Error during author creation: ${error.message}`,
        },
      ];

      setNotifications(notifications);
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
        <Notifications />
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
