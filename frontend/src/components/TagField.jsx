import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../utils/api-endpoint";
import { sortBy } from "../utils/no-lodash";

const fontSize = (weight) => `${(Math.log10(weight) * 8).toFixed(1)}pt`;

const TagWord = ({ id, name, description, refcount, includeSpace }) => {
  const title = description
    ? `${description} (${refcount} references)`
    : `${refcount} references`;
  name = name.replace(/ /g, String.fromCharCode(160));

  return (
    <>
      <Link to={{ pathname: `/tags/show?tag=${id}` }}>
        <span title={title} style={{ fontSize: fontSize(refcount) }}>
          {name}
        </span>
      </Link>
      {includeSpace && " "}
    </>
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
          <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
            {data.tags.map((tag, idx) => (
              <TagWord key={idx} {...tag} includeSpace={idx < count} />
            ))}
          </p>
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
                <Link onClick={() => setSortByName(true)}>name</Link>
              )}
              {" | "}
              {!sortByName ? (
                <strong>count</strong>
              ) : (
                <Link onClick={() => setSortByName(false)}>count</Link>
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
