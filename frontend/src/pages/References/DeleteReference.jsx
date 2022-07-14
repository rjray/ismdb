import React, { useState } from "react";
import { Link, useParams, Redirect } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useToasts } from "react-toast-notifications";

import Header from "../../components/Header";
import FormatDate from "../../components/FormatDate";
import FormatAuthors from "../../components/FormatAuthors";
import FormatTags from "../../components/FormatTags";
import { getReferenceById, deleteReferenceById } from "../../utils/queries";

const DeleteReference = () => {
  const { referenceId } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useMutation(deleteReferenceById);
  const { addToast } = useToasts();
  const { isLoading, error, data } = useQuery(
    ["reference", referenceId],
    getReferenceById,
    { enabled: !deleted }
  );

  if (deleted) {
    queryClient.removeQueries(["reference", String(referenceId)]);
    queryClient.invalidateQueries(["references"]);
    return <Redirect to={{ pathname: "/references" }} />;
  }

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

  const { reference } = data;
  let source;
  if (reference.ReferenceType.name === "book") {
    source = reference.isbn ? `ISBN ${reference.isbn}` : "Book";
  } else if (reference.ReferenceType.name === "article") {
    source = (
      <Link to={`/issues/${reference.MagazineIssue.id}`}>
        {`${reference.Magazine.name} ${reference.MagazineIssue.number}`}
      </Link>
    );
  } else if (reference.ReferenceType.name === "placeholder") {
    source = (
      <Link to={`/issues/${reference.MagazineIssue.id}`}>
        {`${reference.Magazine.name} ${reference.MagazineIssue.number} (placeholder)`}
      </Link>
    );
  } else {
    source = reference.ReferenceType.description;
  }

  const confirmDelete = () => {
    setIsDeleting(true);
    mutate(reference.id, {
      onSuccess: (mutatedData) => {
        const { error: mutationError } = mutatedData;
        setIsDeleting(false);

        if (mutationError) {
          addToast(mutationError.description, { appearance: "error" });
        } else {
          setDeleted(true);
          addToast(`Reference "${reference.name}" deleted`, {
            appearance: "success",
          });
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

        setIsDeleting(false);
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Delete Reference</title>
      </Helmet>
      <Row className="my-3">
        <Col xs={9}>
          <Header>Delete Reference: {reference.name}</Header>
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Source:</strong>
        </Col>
        <Col>{source}</Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Type/Series:</strong>
        </Col>
        <Col>{reference.type}</Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>
            {reference.authors.length === 1 ? "Author: " : "Authors: "}
          </strong>
        </Col>
        <Col>
          {reference.authors.length ? (
            <FormatAuthors authors={reference.authors} nolink />
          ) : (
            "none"
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Language:</strong>
        </Col>
        <Col>{reference.language || "English"}</Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Tags:</strong>
        </Col>
        <Col>
          <FormatTags tags={reference.tags} nolink />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Added:</strong>
        </Col>
        <Col>
          <FormatDate date={reference.createdAt} />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Updated:</strong>
        </Col>
        <Col>
          <FormatDate date={reference.updatedAt} />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <p>
            Click "Delete" to permanently delete this reference. This cannot be
            undone.
          </p>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="submit" onClick={confirmDelete} disabled={isDeleting}>
            Delete
          </Button>{" "}
          <LinkContainer to="/references">
            <Button>Cancel</Button>
          </LinkContainer>
        </Col>
      </Row>
    </>
  );
};

export default DeleteReference;
