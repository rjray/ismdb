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
import FormatAuthorAliases from "../../components/FormatAuthorAliases";
import {
  getAuthorByIdWithRefCount,
  deleteAuthorById,
} from "../../utils/queries";

const DeleteAuthor = () => {
  const { authorId } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const queryCache = useQueryCache();
  const [mutate] = useMutation(deleteAuthorById);
  const { addToast } = useToasts();
  const { isLoading, error, data } = useQuery(
    ["author", authorId, { withRefCount: true }],
    getAuthorByIdWithRefCount,
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
    return <Redirect to={{ pathname: "/authors" }} />;
  }

  const { author } = data;
  const { refcount } = author;
  const noun = refcount === 1 ? "reference" : "references";

  const confirmDelete = () => {
    setIsDeleting(true);
    mutate(author.id, {
      onSuccess: async (mutatedData) => {
        const { error: mutationError } = mutatedData;
        setIsDeleting(false);

        if (mutationError) {
          addToast(mutationError.description, { appearance: "error" });
        } else {
          queryCache.removeQueries(["author", String(author.id)]);
          await queryCache.invalidateQueries(["authors"]);
          setDeleted(true);

          addToast(`Author "${author.name}" deleted`, {
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
        <title>Delete Author</title>
      </Helmet>
      <Row className="my-3">
        <Col xs={9}>
          <Header>Delete Author: {author.name}</Header>
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Added:</strong>
        </Col>
        <Col>
          <FormatDate date={author.createdAt} />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Updated:</strong>
        </Col>
        <Col>
          <FormatDate date={author.updatedAt} />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>
            {author.aliases.length === 1 ? "Alias: " : "Aliases: "}
          </strong>
        </Col>
        <Col>
          {author.aliases.length ? (
            <FormatAuthorAliases aliases={author.aliases} />
          ) : (
            "none"
          )}
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          {refcount ? (
            <>
              <p>
                The author "{author.name}" cannot be removed. They are
                associated with {refcount} {noun}.
              </p>
              <p>Click "Cancel", below, to return to the authors listing.</p>
            </>
          ) : (
            <p>
              Click "Delete" to permanently delete this author. This cannot be
              undone.
            </p>
          )}
        </Col>
      </Row>
      <Row className="mt-3">
        <Col sm={{ span: 10, offset: 2 }}>
          <Button
            type="submit"
            onClick={confirmDelete}
            disabled={refcount || isDeleting}
          >
            Delete
          </Button>{" "}
          <LinkContainer to="/authors">
            <Button>Cancel</Button>
          </LinkContainer>
        </Col>
      </Row>
    </>
  );
};

export default DeleteAuthor;
