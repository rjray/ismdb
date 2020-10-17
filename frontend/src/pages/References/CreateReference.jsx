import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Header from "../../components/Header";
import ReferenceForm from "../../forms/ReferenceForm";
import { multientrySwitch } from "../../atoms";

const CreateReference = () => {
  const [multientry, setMultientry] = useRecoilState(multientrySwitch);
  const [createdReference, setCreatedReference] = useState(null);

  const toggleMultientry = () => setMultientry((current) => !current);

  const submitHandler = (values, formikBag) => {
    alert(JSON.stringify(values, null, 2));
    formikBag.setSubmitting(false);
  };

  if (createdReference && !multientry) {
    return (
      <Redirect
        push
        to={{
          pathname: `/references/update/${createdReference.id}`,
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
    tags: [],
    RecordTypeId: "",
    MagazineId: "",
    MagazineIssueNumber: "",
  };

  return (
    <>
      <Helmet>
        <title>Add a Reference</title>
      </Helmet>
      <Container className="mt-2">
        <Row>
          <Col>
            <Header>Add a Reference</Header>
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
        <ReferenceForm
          submitHandler={submitHandler}
          reference={emptyReference}
        />
      </Container>
    </>
  );
};

export default CreateReference;
