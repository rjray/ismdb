import React from "react";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../../utils/api-endpoint";
import Header from "../../components/Header";
import ReferenceTable from "../../components/ReferenceTable";

const ShowTag = () => {
  const { tagId } = useParams();

  const url = `${apiEndpoint}/api/tags/${tagId}/withReferences`;

  const { isLoading, error, data } = useQuery(
    ["tag-with-references", tagId],
    () => {
      return fetch(url).then((res) => res.json());
    }
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

  const tag = data.tag;
  const tagName = tag.name.replace(/ /g, String.fromCharCode(160));

  return (
    <>
      <Helmet>
        <title>Tag "{tagName}"</title>
      </Helmet>
      <Row className="my-3">
        <Col xs={9}>
          <Header>Tag "{tagName}"</Header>
        </Col>
        <Col className="text-right" xs={3}>
          <LinkContainer to={`/tags/update/${tag.id}`}>
            <Button>Edit</Button>
          </LinkContainer>
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
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>References:</strong>
        </Col>
        <Col>{tag.references.length}</Col>
      </Row>
      <Row>
        <Col>
          <ReferenceTable currentTag={tag.id} data={tag.references} />
        </Col>
      </Row>
    </>
  );
};

export default ShowTag;
