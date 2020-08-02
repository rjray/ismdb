import React, { useState } from "react";
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
import { isEmpty } from "../utils/no-lodash";
import Header from "../components/Header";
import AuthorForm from "../forms/AuthorForm";

const AuthorUpdate = (props) => {
  const id = props.match.params.id;

  const { addToast } = useToasts();
  const [masterAuthor, setMasterAuthor] = useState({});
  const [{ data, loading, error }] = useDataApi(`/api/views/author/${id}`, {
    data: {},
  });

  let content;

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load the author:</p>
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
    const author = isEmpty(masterAuthor) ? data.author : masterAuthor;

    const crudHandler = setupCRUDHandler({
      type: "author",
      onSuccess: (data, formikBag) => {
        const { author, notifications } = data;

        author.aliases = author.aliases.map((item) => {
          return { name: item.name, id: item.id, deleted: false };
        });
        for (let field in author) {
          formikBag.setFieldValue(field, author[field], false);
        }

        notifications.forEach((n) =>
          addToast(n.message, { appearance: n.status })
        );
        setMasterAuthor(author);
      },
      onError: ({ error }, formikBag) => {
        formikBag.resetForm();

        if (Array.isArray(error)) {
          error.forEach((e) => addToast(e.message, { appearance: "error" }));
        } else {
          addToast(error.message, { appearance: "error" });
        }
      },
    });

    const submitHandler = (values, formikBag) => {
      crudHandler(values, formikBag);
      formikBag.setSubmitting(false);
    };

    content = (
      <>
        <Row>
          <Col>
            <Header>Author Update</Header>
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
        <AuthorForm
          author={author}
          action="update"
          submitHandler={submitHandler}
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Author Update</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  );
};

export default AuthorUpdate;
