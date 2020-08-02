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
import MagazineForm from "../forms/MagazineForm";

const MagazineUpdate = (props) => {
  const id = props.match.params.id;

  const { addToast } = useToasts();
  const [masterMagazine, setMasterMagazine] = useState({});
  const [{ data, loading, error }] = useDataApi(
    `/api/views/combo/editmagazine/${id}`,
    {
      data: {},
    }
  );
  let content;

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load the magazine:</p>
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
    const magazine = isEmpty(masterMagazine) ? data.magazine : masterMagazine;

    const crudHandler = setupCRUDHandler({
      type: "magazine",
      onSuccess: (data, formikBag) => {
        const { magazine, notifications } = data;

        magazine.createdAt = new Date(magazine.createdAt);
        magazine.updatedAt = new Date(magazine.updatedAt);
        for (let field in magazine) {
          formikBag.setFieldValue(field, magazine[field], false);
        }

        notifications.forEach((n) =>
          addToast(n.message, { appearance: n.status })
        );
        setMasterMagazine(magazine);
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
            <Header>Magazine Update</Header>
          </Col>
          <Col className="text-right">
            <LinkContainer to={`/magazines/delete/${magazine.id}`}>
              <Button>Delete</Button>
            </LinkContainer>
          </Col>
        </Row>
        <MagazineForm submitHandler={submitHandler} action="update" {...data} />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Magazine Update</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  );
};

export default MagazineUpdate;
