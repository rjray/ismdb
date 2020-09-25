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

const TagWord = ({ id, name, description, refcount, includeSpace }) => {
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
  const [includeNatl, setIncludeNatl] = useState(false);
  const [sortByName, setSortByName] = useState(true);

  // Total tags - 1, to be used in the space-insertion conditional as well:
  const count = 99;
  const params = [`limit=${count + 1}`, "order=refcount,desc", "order=name"];
  if (!includeMeta) {
    params.push("where=type,ne,meta");
  }
  if (!includeNatl) {
    params.push("where=type,ne,nationality");
  }
  const url = `${apiEndpoint}/api/tags/withRefCount?${params.join("&")}`;

  const { isLoading, error, data } = useQuery(
    ["Tag Field", includeMeta, includeNatl],
    () => {
      return fetch(url).then((res) => res.json());
    }
  );

  if (isLoading) {
    return (
      <div>
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
      <Row xs={12} sm={{ span: 6, offset: 3 }}>
        <Col>
          <div className="tag-field">
            {data.tags.map((tag, idx) => (
              <TagWord key={idx} {...tag} includeSpace={idx < count} />
            ))}
          </div>
        </Col>
      </Row>
      <Row xs={12} sm={{ span: 6, offset: 3 }}>
        <Container>
          <Row>
            <Col xs={12} lg={4} className="text-center">
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
            <Col
              xs={12}
              lg={{ span: 4, order: "first" }}
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
              lg={{ span: 4, order: "last" }}
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
