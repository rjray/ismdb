import React, { useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery, useQueryCache, useMutation } from "react-query";
import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useToasts } from "react-toast-notifications";

import Header from "../../components/Header";
import FormatDate from "../../components/FormatDate";
import {
  getMagazineByIdWithIssues,
  deleteMagazineById,
} from "../../utils/queries";

const DeleteMagazine = () => {
  const { magazineId } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const queryCache = useQueryCache();
  const [mutate] = useMutation(deleteMagazineById);
  const { addToast } = useToasts();
  const { isLoading, error, data } = useQuery(
    ["magazine", magazineId, { withIssues: true }],
    getMagazineByIdWithIssues,
    { enabled: !deleted }
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

  if (deleted) {
    return <Redirect to={{ pathname: "/magazines" }} />;
  }

  const { magazine } = data;
  const issuecount = magazine.issues.length;
  const refcount = magazine.issues.reduce(
    (prev, curr) => prev + curr.references.length,
    0
  );
  const issueNoun = issuecount === 1 ? "issue" : "issues";
  const refNoun = refcount === 1 ? "reference" : "references";

  const confirmDelete = () => {
    setIsDeleting(true);
    mutate(magazine.id, {
      onSuccess: async (mutatedData) => {
        const { error: mutationError } = mutatedData;
        setIsDeleting(false);

        if (mutationError) {
          addToast(mutationError.description, { appearance: "error" });
        } else {
          queryCache.removeQueries(["magazine", String(magazine.id)]);
          queryCache.invalidateQueries(["references"]);
          await queryCache.invalidateQueries(["magazines"]);
          setDeleted(true);

          addToast(`Magazine "${magazine.name}" deleted`, {
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
          addToast(error.message, { appearance: "error" });
        }

        setIsDeleting(false);
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Delete Magazine</title>
      </Helmet>
      <Row className="my-3">
        <Col xs={9}>
          <Header>Delete Magazine: {magazine.name}</Header>
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Added:</strong>
        </Col>
        <Col>
          <FormatDate date={magazine.createdAt} />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Updated:</strong>
        </Col>
        <Col>
          <FormatDate date={magazine.updatedAt} />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Language:</strong>
        </Col>
        <Col>{magazine.language || "English"}</Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Aliases:</strong>
        </Col>
        <Col>{magazine.aliases || "none"}</Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Notes:</strong>
        </Col>
        <Col>{magazine.notes || "none"}</Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <p>
            This will remove the magazine "{magazine.name}". This will also
            remove {issuecount} {issueNoun} with {refcount} {refNoun}.
          </p>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="submit" onClick={confirmDelete} disabled={isDeleting}>
            Delete
          </Button>{" "}
          <LinkContainer to="/magazines">
            <Button>Cancel</Button>
          </LinkContainer>
        </Col>
      </Row>
    </>
  );
};

export default DeleteMagazine;
