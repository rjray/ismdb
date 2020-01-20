import React from "react"
import { Link } from "react-router-dom"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ScaleLoader from "react-spinners/ScaleLoader"

import useDataApi from "./utils/data-api"

const FormatAuthors = props => {
  let reference = props.reference
  let content

  if (reference.Authors.length > 0) {
    content = [reference.Authors.length === 1 ? "Author: " : "Authors: "]
    for (let author of reference.Authors) {
      content.push(<Link to={`/authors/${author.id}`}>{author.name}</Link>)
      content.push(", ")
    }
    content.pop()
  }

  return <div>{content}</div>
}

const ExpandReference = props => {
  const [
    { data, loading, error },
  ] = useDataApi(`/api/views/reference/${props.data.id}`, { data: {} })
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

    content = (
      <>
        <Row>
          <Col>Type: {reference.type}</Col>
          <Col className="text-center">
            {reference.language && `Language: ${reference.language}`}
          </Col>
          <Col className="text-right">edit</Col>
        </Row>
        <Row>
          <Col>
            <FormatAuthors reference={reference} />
          </Col>
        </Row>
        <Row>
          <Col>Keywords: {reference.keywords}</Col>
        </Row>
      </>
    )
  }

  return (
    <Container fluid className="mt-2 mb-3">
      {content}
    </Container>
  )
}

export default ExpandReference
