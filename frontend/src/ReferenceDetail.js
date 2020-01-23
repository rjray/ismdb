import React from "react"
import { Link } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import { Helmet } from "react-helmet"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import ScaleLoader from "react-spinners/ScaleLoader"
import { formatDistanceToNow } from "date-fns"

import useDataApi from "./utils/data-api"

const FormatAuthors = props => {
  let reference = props.reference
  let content = []

  if (reference.Authors.length > 0) {
    for (let author of reference.Authors) {
      content.push(
        <Link key={author.id} to={`/authors/${author.id}`}>
          {author.name}
        </Link>
      )
      content.push(", ")
    }
    content.pop()
  }

  return <span>{content}</span>
}

const ReferenceDetail = props => {
  let id = props.match.params.id
  const [{ data, loading, error }] = useDataApi(`/api/views/reference/${id}`, {
    data: {},
  })
  let content

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load data for reference:</p>
        <p>{error.message}</p>
      </>
    )
  } else if (loading) {
    content = (
      <div style={{ textAlign: "center" }}>
        <ScaleLoader />
      </div>
    )
  } else {
    let reference = data.reference
    let created = new Date(reference.createdAt)
    let updated = new Date(reference.updatedAt)
    let recType

    if (reference.RecordType.description === "book") {
      recType = reference.isbn ? `ISBN ${reference.isbn}` : "Book"
    } else if (reference.RecordType.description === "article") {
      recType = `${reference.Magazine.name} ${reference.MagazineIssue.number}`
    } else if (reference.RecordType.description === "placeholder") {
      recType = `${reference.Magazine.name} ${reference.MagazineIssue.number} (placeholder)`
    } else {
      recType = reference.RecordType.notes
    }

    content = (
      <>
        <Row>
          <Col>
            <h2>Reference Detail</h2>
          </Col>
          <Col className="text-right">
            <LinkContainer to={`/references/edit/${reference.id}`}>
              <Button>Edit</Button>
            </LinkContainer>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs lg="2">
            <b>Name:</b>
          </Col>
          <Col lg="8">{reference.name}</Col>
        </Row>
        {reference.language && (
          <Row>
            <Col xs lg="2">
              <b>Language:</b>
            </Col>
            <Col lg="8">{reference.language}</Col>
          </Row>
        )}
        <Row>
          <Col xs lg="2">
            <b>Source:</b>
          </Col>
          <Col lg="8">{recType}</Col>
        </Row>
        <Row>
          <Col xs lg="2">
            <b>Type/Series:</b>
          </Col>
          <Col lg="8">{reference.type}</Col>
        </Row>
        <Row>
          <Col xs lg="2">
            <b>{reference.Authors.length === 1 ? "Author: " : "Authors:"}</b>
          </Col>
          <Col lg="8">
            <FormatAuthors reference={reference} />
          </Col>
        </Row>
        <Row>
          <Col xs lg="2">
            <b>Keywords:</b>
          </Col>
          <Col lg="8">{reference.keywords}</Col>
        </Row>
        <Row>
          <Col xs lg="2">
            <b>Added:</b>
          </Col>
          <Col lg="8">
            <span title={created}>{formatDistanceToNow(created)} ago</span>
          </Col>
        </Row>
        <Row>
          <Col xs lg="2">
            <b>Updated:</b>
          </Col>
          <Col lg="8">
            <span title={updated}>{formatDistanceToNow(updated)} ago</span>
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Reference Detail</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default ReferenceDetail
