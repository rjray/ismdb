import React from "react";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import Header from "../../components/Header";
import TagForm from "../../forms/TagForm";
import { getTagById } from "../../utils/queries";

const UpdateTag = () => {
  const { tagId } = useParams();

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
    alert(JSON.stringify(values, null, 2));
    formikBag.setSubmitting(false);
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
            <LinkContainer
              to={{
                pathname: `/tags/delete/${tag.id}`,
                state: { tag },
              }}
            >
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
        <TagForm tag={tag} submitHandler={submitHandler} />
      </Container>
    </>
  );
};

export default UpdateTag;
