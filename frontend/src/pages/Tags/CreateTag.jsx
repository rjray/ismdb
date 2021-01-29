import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useQueryClient, useMutation } from "react-query";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useToasts } from "react-toast-notifications";

import Header from "../../components/Header";
import TagForm from "../../forms/TagForm";
import { multientrySwitch } from "../../atoms";
import useFocus from "../../utils/focus";
import { createTag } from "../../utils/queries";

const CreateTag = () => {
  const [multientry, setMultientry] = useRecoilState(multientrySwitch);
  const [createdTag, setCreatedTag] = useState(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation(createTag);
  const { addToast } = useToasts();
  const [focus, setFocus] = useFocus();

  const toggleMultientry = () => setMultientry((current) => !current);

  const submitHandler = (values, formikBag) => {
    mutate(values, {
      onSuccess: (data) => {
        const { error, tag } = data;
        formikBag.setSubmitting(false);

        if (error) {
          addToast(error.description, { appearance: "error" });
        } else {
          if (multientry) {
            formikBag.resetForm();
            setFocus();
          }

          queryClient.invalidateQueries(["tags"]);
          queryClient.setQueryData(["tag", String(tag.id)], { tag });

          addToast(`Tag "${tag.name}" created`, { appearance: "success" });
          setCreatedTag(tag.id);
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

  if (createdTag && !multientry) {
    return <Redirect push to={{ pathname: `/tags/${createdTag}` }} />;
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
          autoFocusRef={focus}
        />
      </Container>
    </>
  );
};

export default CreateTag;
