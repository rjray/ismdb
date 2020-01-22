import React from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
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
          <Col className="text-right">edit</Col>
        </Row>
        <Row className="mt-3">
          <Col xs lg="1">
            <b>Name:</b>
          </Col>
          <Col md="auto">{reference.name}</Col>
        </Row>
        {reference.language && (
          <Row>
            <Col xs lg="1">
              <b>Language:</b>
            </Col>
            <Col md="auto">{reference.language}</Col>
          </Row>
        )}
        <Row>
          <Col xs lg="1">
            <b>Source:</b>
          </Col>
          <Col md="auto">{recType}</Col>
        </Row>
        <Row>
          <Col xs lg="1">
            <b>Type/Series:</b>
          </Col>
          <Col md="auto">{reference.type}</Col>
        </Row>
        <Row>
          <Col xs lg="1">
            <b>{reference.Authors.length === 1 ? "Author: " : "Authors:"}</b>
          </Col>
          <Col md="auto">
            <FormatAuthors reference={reference} />
          </Col>
        </Row>
        <Row>
          <Col xs lg="1">
            <b>Keywords:</b>
          </Col>
          <Col md="auto">{reference.keywords}</Col>
        </Row>
        <Row>
          <Col xs lg="1">
            <b>Added:</b>
          </Col>
          <Col md="auto">
            <span title={created}>{formatDistanceToNow(created)} ago</span>
          </Col>
        </Row>
        <Row>
          <Col xs lg="1">
            <b>Updated:</b>
          </Col>
          <Col md="auto">
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
