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
import { getTagByIdWithRefCount, deleteTagById } from "../../utils/queries";

const DeleteTag = () => {
  const { tagId } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const queryCache = useQueryCache();
  const [mutate] = useMutation(deleteTagById);
  const { addToast } = useToasts();
  const { isLoading, error, data } = useQuery(
    ["tag", tagId, { withRefCount: true }],
    getTagByIdWithRefCount,
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
    return <Redirect push to={{ pathname: "/tags" }} />;
  }

  const tag = data.tag;
  const refcount = tag.refcount;
  const noun = refcount === 1 ? "reference" : "references";

  const confirmDelete = () => {
    setIsDeleting(true);
    mutate(tag.id, {
      onSuccess: async (data) => {
        const { error } = data;
        setIsDeleting(false);

        if (error) {
          addToast(error.description, { appearance: "error" });
        } else {
          queryCache.removeQueries(["tag", String(tag.id)]);
          queryCache.invalidateQueries(["references"]);
          await queryCache.invalidateQueries(["tags"]);
          setDeleted(true);

          addToast(`Tag "${tag.name}" deleted`, { appearance: "success" });
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

        setIsDeleting(false);
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Delete Tag</title>
      </Helmet>
      <Row className="my-3">
        <Col xs={9}>
          <Header>Delete Tag: {tag.name}</Header>
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Type:</strong>
        </Col>
        <Col>{tag.type || <em>(none)</em>}</Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Description:</strong>
        </Col>
        <Col>{tag.description || <em>(none)</em>}</Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <p>
            This will remove the tag "{tag.name}" from {refcount} {noun}.
          </p>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="submit" onClick={confirmDelete} disabled={isDeleting}>
            Delete
          </Button>{" "}
          <LinkContainer to="/tags">
            <Button>Cancel</Button>
          </LinkContainer>
        </Col>
      </Row>
    </>
  );
};

export default DeleteTag;
