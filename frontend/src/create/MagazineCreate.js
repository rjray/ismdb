import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useToasts } from "react-toast-notifications";

import AppContext from "../AppContext";
import useDataApi from "../utils/data-api";
import setupCRUDHandler from "../utils/crud";
import Header from "../components/Header";
import MagazineForm from "../forms/MagazineForm";

const MagazineCreate = () => {
  const { addToast } = useToasts();
  const { multientry, toggleMultientry } = useContext(AppContext);
  const [createdMagazine, setCreatedMagazine] = useState(null);
  const [{ data, loading, error }] = useDataApi(
    "/api/views/combo/editmagazine",
    {
      data: {},
    }
  );

  let content;

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load the languages:</p>
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
      type: "magazine",
      onSuccess: (data, formikBag) => {
        const { magazine, notifications } = data;

        magazine.createdAt = new Date(magazine.createdAt);
        magazine.updatedAt = new Date(magazine.updatedAt);

        notifications.forEach((n) =>
          addToast(n.message, { appearance: n.status })
        );
        setCreatedMagazine(magazine);
        formikBag.resetForm();
      },
      onError: ({ error }) => {
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

    if (createdMagazine && !multientry) {
      return (
        <Redirect
          push
          to={{
            pathname: `/magazines/update/${createdMagazine.id}`,
            state: { magazine: createdMagazine },
          }}
        />
      );
    }

    const emptyMagazine = { name: "", language: "", aliases: "", notes: "" };

    content = (
      <>
        <Row>
          <Col>
            <Header>Magazine Creation</Header>
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
                checked={multientry}
                onChange={toggleMultientry}
              />
            </div>
          </Col>
        </Row>
        <MagazineForm
          submitHandler={submitHandler}
          action="create"
          languages={data.languages}
          magazine={emptyMagazine}
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Magazine Creation</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  );
};

export default MagazineCreate;
