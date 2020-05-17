import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScaleLoader from "react-spinners/ScaleLoader";

import useDataApi from "../utils/data-api";
import setupCRUDHandler from "../utils/crud";
import Header from "../components/Header";
import ReferenceForm from "../forms/ReferenceForm";
import Notifications from "../components/Notifications";

const ReferenceCreate = () => {
  const [state, setState] = useState({
    notifications: [],
    createdReference: null,
    stayOnPage: true,
  });
  const [{ data, loading, error }] = useDataApi(
    "/api/views/combo/editreference",
    {
      data: {},
    }
  );

  const { notifications, createdReference, stayOnPage } = state;
  let content;

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load data:</p>
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
    const crudHandler = setupCRUDHandler({
      type: "reference",
      onSuccess: (data, formikBag) => {
        const { reference, notifications } = data;

        reference.createdAt = new Date(reference.createdAt);
        reference.updatedAt = new Date(reference.updatedAt);

        formikBag.resetForm();

        setState({ ...state, notifications: [] });
        setState({
          notifications,
          createdReference: reference,
          stayOnPage,
        });
      },
      onError: (error) => {
        const notes = [
          {
            status: "error",
            result: "Create error",
            resultMessage: `Error during creation: ${error.message}`,
          },
        ];
        setState({ ...state, notifications: [] });
        setState({ ...state, notifications: notes });
      },
    });

    const submitHandler = (values, formikBag) => {
      crudHandler(values, formikBag);
      formikBag.setSubmitting(false);
    };

    if (createdReference && !stayOnPage) {
      return (
        <Redirect
          push
          to={{
            pathname: `/references/update/${createdReference.id}`,
            state: {
              reference: createdReference,
              notifications,
            },
          }}
        />
      );
    }

    const emptyReference = {
      name: "",
      authors: [],
      type: "",
      isbn: "",
      language: "",
      keywords: "",
      RecordTypeId: "",
      MagazineId: "",
      MagazineIssueNumber: "",
    };

    content = (
      <>
        <Row>
          <Col>
            <Header>Reference Creation</Header>
          </Col>
          <Col className="text-right">
            <div className="mr-0 pr-0 align-middle">
              <span>Enter multiple records: </span>
              <Form.Check
                id="enterMultiple"
                inline
                custom
                type="switch"
                className="mr-0 pr-0 align-middle"
                label=""
                checked={stayOnPage}
                onChange={() => {
                  setState({ ...state, stayOnPage: !stayOnPage });
                }}
              />
            </div>
          </Col>
        </Row>
        <ReferenceForm
          {...data}
          submitHandler={submitHandler}
          action="create"
          reference={emptyReference}
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reference Create</title>
      </Helmet>
      <Notifications notifications={notifications} />
      <Container className="mt-2">{content}</Container>
    </>
  );
};

export default ReferenceCreate;
