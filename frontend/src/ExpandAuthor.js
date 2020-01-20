import React from "react"
import { Link } from "react-router-dom"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

const ExpandAuthor = props => (
  <Container fluid className="mt-2 mb-3">
    <Row>
      <Col>
        <Link to={`/authors/${props.data.id}`}>All references</Link>
      </Col>
      <Col className="text-right">edit</Col>
    </Row>
  </Container>
)

export default ExpandAuthor
