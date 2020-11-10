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
import AuthorForm from "../../forms/AuthorForm";
import { useFocus } from "../../utils/focus";
import {
  getAuthorByIdWithRefCount,
  updateAuthorById,
} from "../../utils/queries";

const UpdateAuthor = () => {
  const { authorId } = useParams();
  const queryCache = useQueryCache();
  const [mutate] = useMutation(updateAuthorById);
  const { addToast } = useToasts();
  const [focus, setFocus] = useFocus();
  const { isLoading, error, data } = useQuery(
    ["author", authorId],
    getAuthorByIdWithRefCount
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

  const author = { ...data.author };
  const deletable = author.refcount === 0;
  // Remove this so it doesn't carry over to the form:
  delete author.refcount;

  author.createdAt = new Date(author.createdAt);
  author.updatedAt = new Date(author.updatedAt);

  const submitHandler = (values, formikBag) => {
    mutate(values, {
      onSuccess: (data) => {
        const { error, author } = data;
        formikBag.setSubmitting(false);
        setFocus();

        if (error) {
          addToast(error.description, { appearance: "error" });
        } else {
          queryCache.invalidateQueries(["authors"]);
          queryCache.setQueryData(["author", String(author.id)], { author });

          addToast(`Author "${author.name}" updated`, {
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
        <title>Update Author</title>
      </Helmet>
      <Container className="mt-2">
        <Row>
          <Col>
            <Header>Update Author: {author.name}</Header>
          </Col>
          <Col className="text-right">
            <LinkContainer to={`/authors/delete/${author.id}`}>
              <Button disabled={!deletable}>Delete</Button>
            </LinkContainer>
          </Col>
        </Row>
        <AuthorForm
          author={author}
          submitHandler={submitHandler}
          autoFocusRef={focus}
        />
      </Container>
    </>
  );
};

export default UpdateAuthor;
