import React, { useState, useContext } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import AppContext from "../AppContext";
import useDataApi from "../utils/data-api";
import setupCRUDHandler from "../utils/crud";
import { isEmpty } from "../utils/no-lodash";
import Header from "../components/Header";
import AuthorForm from "../forms/AuthorForm";
import Notifications from "../components/Notifications";

const AuthorUpdate = (props) => {
  const id = props.match.params.id;

  const { setNotifications } = useContext(AppContext);
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
        let author = { ...data.author };
        let notifications = data.notifications || [];

        author.aliases = author.aliases.map((item) => {
          return { name: item.name, id: item.id, deleted: false };
        });
        for (let field in author) {
          formikBag.setFieldValue(field, author[field], false);
        }

        notifications.push({
          status: "success",
          result: "Update success",
          resultMessage: `Author "${author.name}" successfully updated`,
        });

        setNotifications(notifications);
        setMasterAuthor(author);
      },
      onError: (error, formikBag) => {
        formikBag.resetForm();
        const notifications = [
          {
            status: "error",
            result: "Update error",
            resultMessage: `Error during author update: ${error.message}`,
          },
        ];
        setNotifications(notifications);
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
      <Notifications />
      <Container className="mt-2">{content}</Container>
    </>
  );
};

export default AuthorUpdate;
