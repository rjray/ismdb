import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Header from "../../components/Header";
import MagazineForm from "../../forms/MagazineForm";
import { multientrySwitch } from "../../atoms";

const CreateMagazine = () => {
  const [multientry, setMultientry] = useRecoilState(multientrySwitch);
  const [createdMagazine, setCreatedMagazine] = useState(null);

  const toggleMultientry = () => setMultientry((current) => !current);

  const submitHandler = (values, formikBag) => {
    alert(JSON.stringify(values, null, 2));
    formikBag.setSubmitting(false);
  };

  if (createdMagazine && !multientry) {
    return (
      <Redirect
        push
        to={{
          pathname: `/magazines/update/${createdMagazine.id}`,
        }}
      />
    );
  }

  const emptyMagazine = { name: "", language: "", aliases: "", notes: "" };

  return (
    <>
      <Helmet>
        <title>Add a Magazine</title>
      </Helmet>
      <Container className="mt-2">
        <Row>
          <Col>
            <Header>Add a Magazine</Header>
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
        <MagazineForm submitHandler={submitHandler} magazine={emptyMagazine} />
      </Container>
    </>
  );
};

export default CreateMagazine;
