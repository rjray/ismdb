import React from "react"
import { Helmet } from "react-helmet"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ScaleLoader from "react-spinners/ScaleLoader"

import useDataApi from "../utils/data-api"

const MagazineUpdate = props => {
  let id = props.match.params.id

  const [{ data, loading, error }] = useDataApi(`/api/magazine/${id}`, {
    data: {},
  })
  let content

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load the magazine issue:</p>
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
    let magazine = data.magazine

    content = (
      <Form>
        <Form.Group as={Row} controlId="magazine_name">
          <Form.Label column sm={2} className="text-right">
            Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" value={magazine.name} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="magazine_language">
          <Form.Label column sm={2} className="text-right">
            Language
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              value={magazine.language}
              placeholder="Language"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="magazine_aliases">
          <Form.Label column sm={2} className="text-right">
            Aliases
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              value={magazine.aliases}
              placeholder="Aliases"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="magazine_notes">
          <Form.Label column sm={2} className="text-right">
            Notes
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              rows={4}
              value={magazine.notes}
              placeholder="Notes"
            />
          </Col>
        </Form.Group>
      </Form>
    )
  }

  return (
    <>
      <Helmet>
        <title>Magazine Update</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default MagazineUpdate
