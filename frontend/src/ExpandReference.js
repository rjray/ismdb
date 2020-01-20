import React from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ScaleLoader from "react-spinners/ScaleLoader"

import useDataApi from "./utils/data-api"

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
          <Col>{reference.type}</Col>
          <Col className="text-center">{reference.language}</Col>
          <Col className="text-right">edit</Col>
        </Row>
        <Row>
          <Col>{reference.keywords}</Col>
        </Row>
      </>
    )
  }

  return (
    <Container fluid className="mt-2">
      {content}
    </Container>
  )
}

export default ExpandReference
