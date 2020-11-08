import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useQueryCache, useMutation } from "react-query";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useToasts } from "react-toast-notifications";

import Header from "../../components/Header";
import AuthorForm from "../../forms/AuthorForm";
import { multientrySwitch } from "../../atoms";
import { useFocus } from "../../utils/focus";
import { createAuthor } from "../../utils/queries";

const CreateAuthor = () => {
  const [multientry, setMultientry] = useRecoilState(multientrySwitch);
  const [createdAuthor, setCreatedAuthor] = useState(0);
  const queryCache = useQueryCache();
  const [mutate] = useMutation(createAuthor);
  const { addToast } = useToasts();
  const [focus, setFocus] = useFocus();

  const toggleMultientry = () => setMultientry((current) => !current);

  const submitHandler = (values, formikBag) => {
    mutate(values, {
      onSuccess: (data) => {
        const { error, author } = data;
        formikBag.setSubmitting(false);

        if (error) {
          addToast(error.description, { appearance: "error" });
        } else {
          if (multientry) {
            formikBag.resetForm();
            setFocus();
          }

          queryCache.invalidateQueries(["authors"]);
          queryCache.setQueryData(["author", String(author.id)], { author });

          addToast(`Author "${author.name}" created`, {
            appearance: "success",
          });
          setCreatedAuthor(author.id);
        }
      },
      onError: (error) => {
        if (error.response) {
          addToast(error.response.data.error.description, {
            appearance: "error",
          });
        } else {
          addToast(error.message, { appearance: "error" });
        }
        formikBag.setSubmitting(false);
      },
    });
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
          autoFocusRef={focus}
        />
      </Container>
    </>
  );
};

export default CreateAuthor;
