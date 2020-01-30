import React from "react"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import { MdLink } from "react-icons/md"

const ReferenceRecordType = ({ reference }) => {
  const isBook = reference.RecordType.description === "book"
  const isArticle = reference.RecordType.description === "article"
  const isPlaceholder = reference.RecordType.description === "placeholder"

  return (
    <>
      <Form.Group as={Form.Row} controlId="recordType" className="mb-2">
        <Form.Label column sm={2} className="text-md-right text-sm-left">
          Record Type:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            defaultValue={reference.RecordType.notes}
            readOnly
            plaintext
          />
        </Col>
      </Form.Group>
      {isBook && (
        <Form.Group as={Form.Row} controlId="isbn" className="mb-2">
          <Form.Label column sm={2} className="text-md-right text-sm-left">
            ISBN:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              defaultValue={reference.isbn}
              placeholder="Name"
              data-lpignore="true"
            />
          </Col>
        </Form.Group>
      )}
      {(isArticle || isPlaceholder) && (
        <Form.Group as={Form.Row} controlId="magazine" className="mb-2">
          <Form.Label column sm={2} className="text-md-right text-sm-left">
            Magazine:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              defaultValue={`${reference.Magazine.name} ${reference.MagazineIssue.number}`}
              readOnly
              plaintext
            />
          </Col>
        </Form.Group>
      )}
    </>
  )
}

const ReferenceAuthor = ({ author, key }) => {
  return (
    <Form.Group as={Form.Row} controlId={`author${key}`} className="mb-2">
      <Col sm={3}>
        <Form.Control
          type="text"
          defaultValue={author.name}
          placeholder="Name"
          data-lpignore="true"
        />
      </Col>
      <Form.Label column sm={1}>
        <span title="Author info">
          <MdLink />
        </span>
      </Form.Label>
    </Form.Group>
  )
}

const ReferenceAuthors = ({ reference }) => {
  const authors = reference.Authors

  return (
    <Form.Group as={Form.Row} controlId="name" className="mb-2">
      <Form.Label column sm={2} className="text-md-right text-sm-left">
        Authors:
      </Form.Label>
      <Col sm={10}>
        <Container
          fluid
          className="mb-2 pb-0 px-0 d-flex flex-column justify-content-start"
        >
          {authors.map((author, index) => (
            <ReferenceAuthor key={index} author={author} />
          ))}
          <Form.Row>
            <Col>
              <Button>Add</Button>
            </Col>
          </Form.Row>
        </Container>
      </Col>
    </Form.Group>
  )
}

const ReferenceForm = props => {
  const reference = props.reference
  const created = new Date(reference.createdAt)
  const updated = new Date(reference.updatedAt)

  return (
    <Form className="mt-3">
      <Form.Group as={Form.Row} controlId="name" className="mb-2">
        <Form.Label column sm={2} className="text-md-right text-sm-left">
          Name:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            defaultValue={reference.name}
            placeholder="Name"
            data-lpignore="true"
          />
        </Col>
      </Form.Group>
      <ReferenceRecordType reference={reference} />
      <ReferenceAuthors reference={reference} />
      <Form.Group as={Form.Row} controlId="type" className="mb-2">
        <Form.Label column sm={2} className="text-md-right text-sm-left">
          Type:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            defaultValue={reference.type}
            placeholder="Type"
            data-lpignore="true"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Form.Row} controlId="language" className="mb-2">
        <Form.Label column sm={2} className="text-md-right text-sm-left">
          Language:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            defaultValue={reference.language}
            placeholder="Language"
            data-lpignore="true"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Form.Row} controlId="keywords" className="mb-2">
        <Form.Label column sm={2} className="text-md-right text-sm-left">
          Keywords:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            as="textarea"
            rows={4}
            defaultValue={reference.keywords}
            placeholder="Keywords"
          />
        </Col>
      </Form.Group>
      {reference.createdAt && (
        <Form.Group as={Form.Row} controlId="createdAt" className="mb-2">
          <Form.Label column sm={2} className="text-md-right text-sm-left">
            Created:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              readOnly
              plaintext
              defaultValue={created}
            />
          </Col>
        </Form.Group>
      )}
      {reference.updatedAt && (
        <Form.Group as={Form.Row} controlId="updatedAt" className="mb-2">
          <Form.Label column sm={2} className="text-md-right text-sm-left">
            Updated:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
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

export default ReferenceForm
