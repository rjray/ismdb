import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../../utils/api-endpoint";
import { sortBy } from "../../utils/no-lodash";
import "./TagField.css";

const fontSize = (weight) => `${(Math.log10(weight) * 75).toFixed(1)}%`;

const TagWord = ({ id, name, description, refcount }) => {
  const tooltip = description ? (
    <div style={{ textAlign: "left" }}>
      {description} <em>({refcount} references)</em>
    </div>
  ) : (
    <div style={{ textAlign: "left" }}>
      <em>({refcount} references)</em>
    </div>
  );

  return (
    <div className="tag-word">
      <OverlayTrigger overlay={<Tooltip id={`tag-${id}`}>{tooltip}</Tooltip>}>
        <Link to={{ pathname: `/tags/${id}` }}>
          <span style={{ fontSize: fontSize(refcount) }}>{name}</span>
        </Link>
      </OverlayTrigger>
    </div>
  );
};

const TagField = () => {
  const [includeMeta, setIncludeMeta] = useState(false);
  const [includeScale, setIncludeScale] = useState(false);
  const [includeNatl, setIncludeNatl] = useState(false);
  const [sortByName, setSortByName] = useState(true);

  // Total tags to display:
  const count = 100;
  const params = [`limit=${count}`, "order=refcount,desc", "order=name"];
  if (!includeMeta) {
    params.push("where=type,ne,meta");
  }
  if (!includeScale) {
    params.push("where=type,ne,scale");
  }
  if (!includeNatl) {
    params.push("where=type,ne,nationality");
  }
  const url = `${apiEndpoint}/api/tags/withRefCount?${params.join("&")}`;

  const { isLoading, error, data } = useQuery(
    ["Tag Field", includeMeta, includeScale, includeNatl, sortByName],
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

  if (sortByName) {
    data.tags.sort(sortBy("name"));
  }
  return (
    <>
      <Row xs={12} sm={{ span: 6, offset: 3 }} className="my-2">
        <Col>
          <div className="tag-field">
            {data.tags.map((tag, idx) => (
              <TagWord key={tag.id} {...tag} includeSpace={idx < count} />
            ))}
          </div>
        </Col>
      </Row>
      <Row xs={12} sm={{ span: 6, offset: 3 }}>
        <Container>
          <Row>
            <Col xs={12} className="text-center">
              <span>sort by </span>
              {sortByName ? (
                <strong>name</strong>
              ) : (
                <Link to="" onClick={() => setSortByName(true)}>
                  name
                </Link>
              )}
              {" | "}
              {!sortByName ? (
                <strong>count</strong>
              ) : (
                <Link to="" onClick={() => setSortByName(false)}>
                  count
                </Link>
              )}
            </Col>
          </Row>
          <Row>
            <Col
              xs={12}
              lg={6}
              xl={4}
              className="text-xs-center text-sm-center text-lg-left"
            >
              <span>include meta tags </span>
              <Form.Check
                id="toggleMetaTags"
                className="mr-0 pr-0 align-middle"
                inline
                custom
                type="switch"
                label=""
                checked={includeMeta}
                onChange={() => setIncludeMeta((includeMeta) => !includeMeta)}
              />
            </Col>
            <Col
              xs={12}
              lg={{ span: 12, order: "first" }}
              xl={{ span: 4, order: 2 }}
              className="text-center"
            >
              <span>include scale tags </span>
              <Form.Check
                id="toggleScaleTags"
                className="mr-0 pr-0 align-middle"
                inline
                custom
                type="switch"
                label=""
                checked={includeScale}
                onChange={() =>
                  setIncludeScale((includeScale) => !includeScale)
                }
              />
            </Col>
            <Col
              xs={12}
              lg={{ span: 6, order: "last" }}
              xl={{ span: 4, order: "last" }}
              className="text-xs-center text-sm-center text-lg-right"
            >
              <span>include nationality tags </span>
              <Form.Check
                id="toggleNatlTags"
                className="mr-0 pr-0 align-middle"
                inline
                custom
                type="switch"
                label=""
                checked={includeNatl}
                onChange={() => setIncludeNatl((includeNatl) => !includeNatl)}
              />
            </Col>
          </Row>
        </Container>
      </Row>
    </>
  );
};

export default TagField;
