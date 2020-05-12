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
import MagazineForm from "../forms/MagazineForm";
import Notifications from "../components/Notifications";

const MagazineCreate = () => {
  const [state, setState] = useState({
    notifications: [],
    createdMagazine: null,
    stayOnPage: true,
  });
  const [{ data, loading, error }] = useDataApi(
    "/api/views/combo/editmagazine",
    {
      data: {},
    }
  );

  const { notifications, createdMagazine, stayOnPage } = state;
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
        let magazine = { ...data.magazine };
        let notes;

        magazine.createdAt = new Date(magazine.createdAt);
        magazine.updatedAt = new Date(magazine.updatedAt);

        if (data.notifications) {
          notes = data.notifications;
        } else {
          notes = [];
        }
        notes.push({
          status: "success",
          result: "Creation success",
          resultMessage: `Magazine "${magazine.name}" successfully created`,
        });

        formikBag.resetForm();

        setState({ ...state, notifications: [] });
        setState({
          notifications: notes,
          createdMagazine: magazine,
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

    if (createdMagazine && !stayOnPage) {
      return (
        <Redirect
          push
          to={`/magazines/update/${createdMagazine.id}`}
          magazine={createdMagazine}
          notifications={notifications}
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
                checked={stayOnPage}
                onChange={() => {
                  setState({ ...state, stayOnPage: !stayOnPage });
                }}
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
      <Notifications notifications={notifications} />
      <Container className="mt-2">{content}</Container>
    </>
  );
};

export default MagazineCreate;
