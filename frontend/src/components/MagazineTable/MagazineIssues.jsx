import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import compareVersion from "../../utils/compare-version";
import { chunk } from "../../utils/no-lodash";

const IssuesRow = ({ row }) => {
  while (row.length < 10) {
    row.push({ id: 0, number: "" });
  }

  return (
    <Row>
      {row.map((item, idx) => (
        <Col key={idx} xs={5} md={1}>
          {item.id ? <Link to={`/issues/${item.id}`}>{item.number}</Link> : ""}
        </Col>
      ))}
    </Row>
  );
};

const MagazineIssues = ({ issues }) => {
  issues = issues.sort((a, b) => compareVersion(a.number, b.number));
  const rows = chunk(issues, 10);

  return (
    <Container fluid>
      {rows.map((row, idx) => (
        <IssuesRow key={idx} row={row} />
      ))}
    </Container>
  );
};

export default MagazineIssues;
