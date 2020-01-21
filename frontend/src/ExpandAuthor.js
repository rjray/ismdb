import React from "react"
import { Link } from "react-router-dom"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

const ExpandAuthor = props => {
  let aliases = props.data.aliases
    ? `Aliases: ${props.data.aliases.replace(/\|/g, ", ")}`
    : ""

  return (
    <Container fluid className="mt-2 mb-3">
      <Row>
        <Col>{aliases}</Col>
        <Col className="text-right">edit</Col>
      </Row>
      <Row>
        <Col>
          <Link to={`/authors/${props.data.id}`}>All references</Link>
        </Col>
      </Row>
    </Container>
  )
}

export default ExpandAuthor
