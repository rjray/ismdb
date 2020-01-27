import React from "react"
import { LinkContainer } from "react-router-bootstrap"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"

const AuthorExpand = props => {
  let aliases = props.data.aliases

  return (
    <Container fluid className="mt-2 mb-3">
      <Row>
        <Col>
          <LinkContainer to={`/authors/${props.data.id}`}>
            <Button>View</Button>
          </LinkContainer>
        </Col>
        <Col className="text-right">
          <LinkContainer to={`/authors/update/${props.data.id}`}>
            <Button>Edit</Button>
          </LinkContainer>
        </Col>
      </Row>
      <Row>
        <Col>{aliases && `Aliases: ${aliases.replace(/\|/g, ", ")}`}</Col>
      </Row>
    </Container>
  )
}

export default AuthorExpand
