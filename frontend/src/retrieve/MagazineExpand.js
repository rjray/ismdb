import React from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import useDataApi from "../utils/data-api";
import compareVersion from "../utils/compare-version";
import { chunk } from "../utils/no-lodash";

const createIssueRow = (mId, elements) => {
  if (elements.length < 10) {
    let id = elements[elements.length - 1].id + 1000;

    while (elements.length < 10) {
      elements.push({ id: id++, number: "" });
    }
  }

  return elements.map((item) => (
    <Col key={item.id} xs={5} sm={5} md={1}>
      {item.number ? (
        <Link to={`/magazines/${mId}/${item.id}`}>{item.number}</Link>
      ) : (
        ""
      )}
    </Col>
  ));
};

const MagazineExpand = (props) => {
  const [
    { data, loading, error },
  ] = useDataApi(`/api/views/magazine/${props.data.id}`, { data: {} });
  let content;

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load data for magazine:</p>
        <p>{error.message}</p>
      </>
    );
  } else if (loading) {
    content = (
      <div style={{ textAlign: "center" }}>
        <ScaleLoader />
      </div>
    );
  } else {
    let magazine = data.magazine;
    let issues = magazine.issues.sort((a, b) =>
      compareVersion(a.number, b.number)
    );
    let chunks = chunk(issues, 10);
    let rows = chunks.map((row, idx) => {
      let rowInner = createIssueRow(magazine.id, row);
      return <Row key={idx}>{rowInner}</Row>;
    });

    if (magazine.notes) {
      rows.push(
        <Row key="notes" className="mt-1">
          <Col>Notes: {magazine.notes}</Col>
        </Row>
      );
    }
    rows.unshift(
      <Row key="title" className="mb-1">
        <Col>
          <LinkContainer to={`/magazines/${magazine.id}`}>
            <Button>View</Button>
          </LinkContainer>
          &nbsp;
          <LinkContainer to={`/magazines/update/${magazine.id}`}>
            <Button>Edit</Button>
          </LinkContainer>
        </Col>
        <Col>{magazine.language && `Language: ${magazine.language}`}</Col>
      </Row>
    );

    content = rows;
  }

  return (
    <Container fluid className="mt-2 mb-3">
      {content}
    </Container>
  );
};

export default MagazineExpand;
