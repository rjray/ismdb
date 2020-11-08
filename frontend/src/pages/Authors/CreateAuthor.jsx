import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Header from "../../components/Header";
import AuthorForm from "../../forms/AuthorForm";
import { multientrySwitch } from "../../atoms";

const CreateAuthor = () => {
  const [multientry, setMultientry] = useRecoilState(multientrySwitch);
  const [createdAuthor, setCreatedAuthor] = useState(0);

  const toggleMultientry = () => setMultientry((current) => !current);

  const submitHandler = (values, formikBag) => {
    alert(JSON.stringify(values, null, 2));
    formikBag.setSubmitting(false);
  };

  if (createdAuthor && !multientry) {
    return <Redirect push to={{ pathname: `/authors/${createdAuthor}` }} />;
  }

  return (
    <>
      <Helmet>
        <title>Add an Author</title>
      </Helmet>
      <Container className="mt-2">
        <Row>
          <Col>
            <Header>Add an Author</Header>
          </Col>
          <Col className="text-right">
            <div className="mr-0 pr-0 align-middle">
              <span>Enter multiple authors: </span>
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
        <AuthorForm
          submitHandler={submitHandler}
          author={{ name: "", notes: "", aliases: [] }}
        />
      </Container>
    </>
  );
};

export default CreateAuthor;
