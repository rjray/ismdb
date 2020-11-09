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
import TagForm from "../../forms/TagForm";
import { useFocus } from "../../utils/focus";
import { getTagById, updateTagById } from "../../utils/queries";

const UpdateTag = () => {
  const { tagId } = useParams();
  const queryCache = useQueryCache();
  const [mutate] = useMutation(updateTagById);
  const { addToast } = useToasts();
  const [focus, setFocus] = useFocus();
  const { isLoading, error, data } = useQuery(["tag", tagId], getTagById);

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

  const tag = { ...data.tag };
  const splittable = tag.name.match(/ /);

  const submitHandler = (values, formikBag) => {
    mutate(values, {
      onSuccess: (data) => {
        const { error, tag } = data;
        formikBag.setSubmitting(false);
        setFocus();

        if (error) {
          addToast(error.description, { appearance: "error" });
        } else {
          queryCache.invalidateQueries(["tags"]);
          queryCache.setQueryData(["tag", String(tag.id)], { tag });

          addToast(`Tag "${tag.name}" updated`, { appearance: "success" });
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
        <title>Update Tag</title>
      </Helmet>
      <Container className="mt-2">
        <Row>
          <Col>
            <Header>Update Tag: {tag.name}</Header>
          </Col>
          <Col className="text-right">
            <LinkContainer to={`/tags/delete/${tag.id}`}>
              <Button>Delete</Button>
            </LinkContainer>
            {splittable && (
              <>
                <br />
                <Button className="mt-2">Split Tag</Button>
              </>
            )}
          </Col>
        </Row>
        <TagForm tag={tag} submitHandler={submitHandler} autoFocusRef={focus} />
      </Container>
    </>
  );
};

export default UpdateTag;
