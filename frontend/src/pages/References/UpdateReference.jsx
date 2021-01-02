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
import useFocus from "../../utils/focus";
import { getReferenceById, updateReferenceById } from "../../utils/queries";

const UpdateReference = () => {
  const { referenceId } = useParams();
  const queryCache = useQueryCache();
  const [mutate] = useMutation(updateReferenceById);
  const { addToast } = useToasts();
  const [focusOnName, setFocusOnName] = useFocus();
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

  reference.authors = reference.authors.map((item) => ({
    ...item,
    deleted: false,
  }));
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
    delete values.createdAt;
    delete values.updatedAt;
    if (typeof values.type === "object") values.type = values.type.label;
    if (typeof values.language === "object")
      values.language = values.language.label;

    mutate(values, {
      onSuccess: (mutatedData) => {
        const {
          error: mutationError,
          reference: mutatedReference,
          notifications,
          authorsUpdated,
          tagsUpdated,
        } = mutatedData;
        formikBag.setSubmitting(false);
        setFocusOnName();

        if (mutationError) {
          addToast(mutationError.description, { appearance: "error" });
        } else {
          queryCache.invalidateQueries(["references"]);
          if (authorsUpdated) queryCache.invalidateQueries(["authors"]);
          if (tagsUpdated) queryCache.invalidateQueries(["tags"]);
          queryCache.setQueryData(["reference", String(mutatedReference.id)], {
            mutatedReference,
          });

          addToast(`Reference "${mutatedReference.name}" updated`, {
            appearance: "success",
          });

          if (notifications && notifications.length) {
            notifications.forEach((n) =>
              addToast(n.message, { appearance: n.type })
            );
          }
        }
      },
      onError: (mutationError) => {
        if (mutationError.response) {
          addToast(mutationError.response.data.error.description, {
            appearance: "error",
          });
        } else {
          addToast(mutationError.message, { appearance: "error" });
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
          autoFocusRef={focusOnName}
        />
      </Container>
    </>
  );
};

export default UpdateReference;
