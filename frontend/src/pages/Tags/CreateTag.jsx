import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Header from "../../components/Header";
import TagForm from "../../forms/TagForm";
import { multientrySwitch } from "../../atoms";

const CreateTag = () => {
  const [multientry, setMultientry] = useRecoilState(multientrySwitch);
  const [createdTag, setCreatedTag] = useState(false);

  const toggleMultientry = () => setMultientry((current) => !current);

  const submitHandler = (values, formikBag) => {
    alert(JSON.stringify(values, null, 2));
    formikBag.setSubmitting(false);
  };

  if (createdTag && !multientry) {
    return <Redirect push to={{ pathname: "/tags" }} />;
  }

  return (
    <>
      <Helmet>
        <title>Add a Tag</title>
      </Helmet>
      <Container className="mt-2">
        <Row>
          <Col>
            <Header>Add a Tag</Header>
          </Col>
          <Col className="text-right">
            <div className="mr-0 pr-0 align-middle">
              <span>Enter multiple tags: </span>
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
        <TagForm
          submitHandler={submitHandler}
          tag={{ name: "", description: "", type: "" }}
        />
      </Container>
    </>
  );
};

export default CreateTag;
