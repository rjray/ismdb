import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Header from "../../components/Header";
import AuthorForm from "../../forms/AuthorForm";

const CreateAuthor = () => {
  const [authorCreated, setAuthorCreated] = useState(false);

  const submitHandler = (values, formikBag) => {
    alert(JSON.stringify(values, null, 2));
    formikBag.setSubmitting(false);
  };

  if (authorCreated) {
    return <Redirect push to={{ pathname: "/authors" }} />;
  }

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
};

export default CreateAuthor;
