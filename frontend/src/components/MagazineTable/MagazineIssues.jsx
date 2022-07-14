import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import compareVersion from "../../utils/compare-version";
import { chunk } from "../../utils/no-lodash";

const IssuesRow = ({ row }) => {
  if (row.length < 10) {
    let counter = 0;
    while (row.length < 10) {
      row.push({ id: `dummy${counter++}`, number: "" });
    }
  }

  return (
    <Row>
      {row.map((item) => (
        <Col key={item.id} xs={5} md={1}>
          {typeof item.id === "number" ? (
            <Link to={`/issues/${item.id}`}>{item.number}</Link>
          ) : (
            ""
          )}
        </Col>
      ))}
    </Row>
  );
};

IssuesRow.propTypes = {
  row: PropTypes.array.isRequired,
};

const MagazineIssues = ({ issues }) => {
  const sortedIssues = issues.sort((a, b) =>
    compareVersion(a.number, b.number)
  );
  const rows = chunk(sortedIssues, 10);

  return (
    <Container fluid>
      {rows.map((row) => (
        <IssuesRow key={row[0].issue} row={row} />
      ))}
    </Container>
  );
};

MagazineIssues.propTypes = {
  issues: PropTypes.array.isRequired,
};

export default MagazineIssues;
