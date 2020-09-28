import React from "react";
import Container from "react-bootstrap/Container";

import IssueReferenceTable from "../IssueReferenceTable";

const IssueExpand = ({ data: issue }) => (
  <Container fluid className="mt-2 mb-3">
    <IssueReferenceTable data={issue.references} noHeader />
  </Container>
);

export default IssueExpand;
