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
import ReferenceForm from "../../forms/ReferenceForm";
import { multientrySwitch } from "../../atoms";
import useFocus from "../../utils/focus";
import { createReference } from "../../utils/queries";

const CreateReference = () => {
  const [multientry, setMultientry] = useRecoilState(multientrySwitch);
  const [createdReference, setCreatedReference] = useState(0);
  const queryCache = useQueryCache();
  const [mutate] = useMutation(createReference);
  const { addToast } = useToasts();
  const [focusOnName, setFocusOnName] = useFocus();

  const toggleMultientry = () => setMultientry((current) => !current);

  const submitHandler = (valuesIn, formikBag) => {
    const values = { ...valuesIn };

    values.authors = values.authors
      .filter((a) => !a.deleted)
      .map(({ id, name }) => {
        // eslint-disable-next-line no-param-reassign
        if (typeof id === "string") id = 0;
        return { id, name };
      });
    values.tags = values.tags.map(({ id, name }) => {
      // eslint-disable-next-line no-param-reassign
      if (typeof id === "string") id = 0;
      return { id, name };
    });
    values.RecordTypeId = parseInt(values.RecordTypeId, 10);
    values.MagazineId = parseInt(values.MagazineId, 10) || 0;

    if (typeof values.type === "object") values.type = values.type.label;
    if (typeof values.language === "object")
      values.language = values.language.label;

    mutate(values, {
      onSuccess: (data) => {
        const { error, reference, notifications, addedAuthors } = data;
        formikBag.setSubmitting(false);

        if (error) {
          addToast(error.description, { appearance: "error" });
        } else {
          if (multientry) {
            formikBag.resetForm();
            setFocusOnName();
          }

          queryCache.invalidateQueries(["references"]);
          if (addedAuthors) queryCache.invalidateQueries(["authors"]);
          queryCache.setQueryData(["reference", String(reference.id)], {
            reference,
          });

          addToast(`Reference "${reference.name}" created`, {
            appearance: "success",
          });

          if (notifications && notifications.length) {
            notifications.forEach((n) =>
              addToast(n.message, { appearance: n.type })
            );
          }

          setCreatedReference(reference.id);
        }
      },
      onError: (error) => {
        if (error.response?.data?.error) {
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

  if (createdReference && !multientry) {
    return (
      <Redirect push to={{ pathname: `/references/${createdReference}` }} />
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
              <span>Enter multiple references: </span>
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
          autoFocusRef={focusOnName}
        />
      </Container>
    </>
  );
};

export default CreateReference;
