import React from "react";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

import Header from "../../components/Header";
import FormatDate from "../../components/FormatDate";
import IssueReferenceTable from "../../components/IssueReferenceTable";
import { getMagazineIssueById } from "../../utils/queries";

const ShowIssue = () => {
  const { issueId } = useParams();
  const { isLoading, error, data } = useQuery(
    ["issue", issueId],
    getMagazineIssueById
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

  const issue = data.issue;
  const issueName = `${issue.Magazine.name} ${issue.number}`;

  return (
    <>
      <Helmet>
        <title>{issueName}</title>
      </Helmet>
      <Row className="my-3">
        <Col xs={9}>
          <Header>{issueName}</Header>
        </Col>
        <Col className="text-right" xs={3}>
          <LinkContainer to={`/issues/delete/${issue.id}`}>
            <Button>Delete</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Added:</strong>
        </Col>
        <Col>
          <FormatDate date={issue.createdAt} />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>Updated:</strong>
        </Col>
        <Col>
          <FormatDate date={issue.updatedAt} />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={4} md={2} xl={1} className="text-right">
          <strong>References:</strong>
        </Col>
        <Col>{issue.references.length}</Col>
      </Row>
      <Row>
        <Col>
          <IssueReferenceTable data={issue.references} />
        </Col>
      </Row>
    </>
  );
};

export default ShowIssue;
