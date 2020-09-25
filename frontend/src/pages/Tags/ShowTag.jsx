import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../../utils/api-endpoint";
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

  const tag = data.tag.name.replace(/ /g, String.fromCharCode(160));

  return (
    <>
      <Helmet>
        <title>Tag "{tag}"</title>
      </Helmet>
      <Row className="mb-3">
        <Col className="text-center" xs={12}>
          <h1>References Tagged with "{tag}"</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <ReferenceTable currentTag={data.tag.id} data={data.tag.references} />
        </Col>
      </Row>
    </>
  );
};

export default ShowTag;
