import React from "react"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"

const MagazineForm = props => {
  const magazine = props.magazine
  const created = new Date(magazine.createdAt)
  const updated = new Date(magazine.updatedAt)

  return (
    <Form className="mt-3">
      <Form.Group as={Form.Row} controlId="name">
        <Form.Label column sm={2} className="text-md-right text-sm-left">
          Name:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            defaultValue={magazine.name}
            placeholder="Name"
            data-lpignore="true"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Form.Row} controlId="language">
        <Form.Label column sm={2} className="text-md-right text-sm-left">
          Language:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            defaultValue={magazine.language}
            placeholder="Language"
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
            defaultValue={magazine.aliases}
            placeholder="Aliases"
            data-lpignore="true"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Form.Row} controlId="notes">
        <Form.Label column sm={2} className="text-md-right text-sm-left">
          Notes:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            as="textarea"
            rows={4}
            defaultValue={magazine.notes}
            placeholder="Notes"
          />
        </Col>
      </Form.Group>
      {magazine.createdAt && (
        <Form.Group as={Form.Row} controlId="createdAt">
          <Form.Label column sm={2} className="text-md-right text-sm-left">
            Created:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              tabIndex={-1}
              readOnly
              plaintext
              defaultValue={created}
            />
          </Col>
        </Form.Group>
      )}
      {magazine.updatedAt && (
        <Form.Group as={Form.Row} controlId="updatedAt">
          <Form.Label column sm={2} className="text-md-right text-sm-left">
            Updated:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              tabIndex={-1}
              readOnly
              plaintext
              defaultValue={updated}
            />
          </Col>
        </Form.Group>
      )}
      <Form.Group as={Form.Row} className="mt-3">
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="submit">Submit</Button>{" "}
          <Button type="reset">Reset</Button>
        </Col>
      </Form.Group>
    </Form>
  )
}

export default MagazineForm
