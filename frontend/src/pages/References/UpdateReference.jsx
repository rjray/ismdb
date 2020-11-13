import React from "react";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery, useQueryCache, useMutation } from "react-query";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useToasts } from "react-toast-notifications";

import Header from "../../components/Header";
import ReferenceForm from "../../forms/ReferenceForm";
import { useFocus } from "../../utils/focus";
import { getReferenceById, updateReferenceById } from "../../utils/queries";

const UpdateReference = () => {
  const { referenceId } = useParams();
  const queryCache = useQueryCache();
  const [mutate] = useMutation(updateReferenceById);
  const { addToast } = useToasts();
  const [focus, setFocus] = useFocus();
  const { isLoading, error, data } = useQuery(
    ["reference", referenceId],
    getReferenceById
  );

  if (isLoading) {
    return (
      <div className="text-center">
        <ScaleLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <strong>Error: {error.message}</strong>
      </div>
    );
  }

  const reference = { ...data.reference };

  reference.authors = reference.authors.map((item) => {
    return { ...item, deleted: false };
  });
  reference.createdAt = new Date(reference.createdAt);
  reference.updatedAt = new Date(reference.updatedAt);
  reference.MagazineId = reference.Magazine ? reference.Magazine.id : "";
  reference.MagazineIssueNumber = reference.MagazineIssue
    ? reference.MagazineIssue.number
    : "";
  delete reference.Magazine;
  delete reference.MagazineIssue;
  delete reference.RecordType;
  // Force this to a string:
  reference.RecordTypeId = String(reference.RecordTypeId);

  const submitHandler = (values, formikBag) => {
    // The "language" and "type" keys are indirected for use by Typeahead:
    values = { ...values };
    values.language = values.language.language;
    values.type = values.type.type;

    mutate(values, {
      onSuccess: (data) => {
        const { error, reference } = data;
        formikBag.setSubmitting(false);
        setFocus();

        if (error) {
          addToast(error.description, { appearance: "error" });
        } else {
          queryCache.invalidateQueries(["references"]);
          queryCache.setQueryData(["reference", String(reference.id)], {
            reference,
          });

          addToast(`Reference "${reference.name}" updated`, {
            appearance: "success",
          });
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

  return (
    <>
      <Helmet>
        <title>Reference Update</title>
      </Helmet>
      <Container className="mt-2">
        <Row>
          <Col>
            <Header>Reference Update</Header>
          </Col>
          <Col className="text-right">
            <LinkContainer
              to={{
                pathname: `/references/delete/${reference.id}`,
                state: { reference },
              }}
            >
              <Button>Delete</Button>
            </LinkContainer>
          </Col>
        </Row>
        <ReferenceForm
          reference={reference}
          submitHandler={submitHandler}
          autoFocusRef={focus}
        />
      </Container>
    </>
  );
};

export default UpdateReference;
