import React, { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import useDataApi from "../utils/data-api";
import setupCRUDHandler from "../utils/crud";
import { isEmpty } from "../utils/no-lodash";
import Header from "../styles/Header";
import AuthorForm from "../forms/AuthorForm";
import Notifications from "../components/Notifications";

const AuthorUpdate = (props) => {
  const id = props.match.params.id;
  const [notifications, setNotifications] = useState([]);
  const [masterAuthor, setMasterAuthor] = useState({});
  const [{ data, loading, error }] = useDataApi(`/api/retrieve/author/${id}`, {
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
        let notes;

        author.aliases = author.aliases.map((item) => {
          return { name: item.name, id: item.id, deleted: false };
        });
        for (let field in author) {
          formikBag.setFieldValue(field, author[field], false);
        }

        if (data.notifications) {
          notes = data.notifications;
        } else {
          notes = [];
        }
        notes.push({
          status: "success",
          result: "Update success",
          resultMessage: `Author "${author.name}" successfully updated`,
        });
        setNotifications([]);
        setNotifications(notes);

        setMasterAuthor(author);
      },
      onError: (error, formikBag) => {
        formikBag.resetForm();
        const notes = [
          {
            status: "error",
            result: "Update error",
            resultMessage: `Error during update: ${error.message}`,
          },
        ];
        setNotifications([]);
        setNotifications(notes);
      },
    });

    const submitHandler = (values, formikBag) => {
      let oldAuthor = { ...author };
      let newAuthor = { ...values };
      delete newAuthor.action;
      oldAuthor.aliases.forEach((item) => (item.deleted = false));

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
            <LinkContainer to={`/authors/delete/${author.id}`}>
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
      <Notifications notifications={notifications} />
      <Container className="mt-2">{content}</Container>
    </>
  );
};

export default AuthorUpdate;
