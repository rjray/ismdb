import React, { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";
import deepEqual from "deep-equal";
import _ from "lodash";

import useDataApi from "../utils/data-api";
import setupCRUDHandler from "../utils/crud";
import Header from "../styles/Header";
import MagazineForm from "../forms/MagazineForm";
import Notifications from "../components/Notifications";

const MagazineUpdate = (props) => {
  const id = props.match.params.id;
  const [notifications, setNotifications] = useState([]);
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
    const magazine = _.isEmpty(masterMagazine) ? data.magazine : masterMagazine;

    const crudHandler = setupCRUDHandler({
      type: "magazine",
      onSuccess: (data, formikBag) => {
        let magazine = { ...data.magazine };
        let notes;

        magazine.createdAt = new Date(magazine.createdAt);
        magazine.updatedAt = new Date(magazine.updatedAt);
        for (let field in magazine) {
          formikBag.setFieldValue(field, magazine[field], false);
        }

        if (data.notifications) {
          notes = data.notifications;
        } else {
          notes = [];
        }
        notes.push({
          status: "success",
          result: "Update success",
          resultMessage: `Magazine "${magazine.name}" successfully updated`,
        });
        setNotifications([]);
        setNotifications(notes);

        setMasterMagazine(magazine);
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
      let oldMagazine = { ...magazine };
      let newMagazine = { ...values };
      for (let key of ["action", "createdAt", "updatedAt"]) {
        delete oldMagazine[key];
        delete newMagazine[key];
      }

      if (!deepEqual(oldMagazine, newMagazine)) {
        crudHandler(values, formikBag);
      }
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
      <Notifications notifications={notifications} />
      <Container className="mt-2">{content}</Container>
    </>
  );
};

export default MagazineUpdate;
