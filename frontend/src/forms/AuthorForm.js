import React from "react"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"

const AuthorForm = props => {
  const author = props.author

  return (
    <Form className="mt-3">
      <Form.Group as={Form.Row} controlId="name">
        <Form.Label column sm={2} className="text-md-right text-sm-left">
          Name:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            defaultValue={author.name}
            placeholder="Name"
            data-lpignore="true"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Form.Row} controlId="aliases">
        <Form.Label column sm={2} className="text-md-right text-sm-left">
          Aliases:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            defaultValue={author.aliases}
            placeholder="Aliases"
            data-lpignore="true"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Form.Row} className="mt-3">
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="submit">Submit</Button>{" "}
          <Button type="reset">Reset</Button>
        </Col>
      </Form.Group>
    </Form>
  )
}

export default AuthorForm
