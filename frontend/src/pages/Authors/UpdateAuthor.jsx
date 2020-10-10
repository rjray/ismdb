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
import AuthorForm from "../../forms/AuthorForm";

const AuthorUpdate = () => {
  const { authorId } = useParams();

  const url = `${apiEndpoint}/api/authors/${authorId}`;

  const { isLoading, error, data } = useQuery(["author", authorId], () => {
    return fetch(url).then((res) => res.json());
  });

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

  const author = { ...data.author };

  const submitHandler = (values, formikBag) => {
    alert(JSON.stringify(values, null, 2));
    formikBag.setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Update Author</title>
      </Helmet>
      <Container className="mt-2">
        <Row>
          <Col>
            <Header>Update Author: {author.name}</Header>
          </Col>
          <Col className="text-right">
            <LinkContainer
              to={{
                pathname: `/authors/delete/${author.id}`,
                state: { author },
              }}
            >
              <Button>Delete</Button>
            </LinkContainer>
          </Col>
        </Row>
        <AuthorForm author={author} submitHandler={submitHandler} />
      </Container>
    </>
  );
};

export default AuthorUpdate;
