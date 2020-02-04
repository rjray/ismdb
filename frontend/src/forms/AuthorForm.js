import React from "react"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import { Formik, Field, FieldArray } from "formik"
import { MdDelete } from "react-icons/md"
import _ from "lodash"

const AuthorAlias = ({ alias, index }) => {
  return (
    <Form.Group as={Form.Row} controlId={`alias${index}`} className="mb-2">
      <Col sm={3}>
        <Form.Control
          type="text"
          defaultValue={alias.name}
          placeholder="Alias"
          data-lpignore="true"
        />
      </Col>
      <Col sm>
        <span>
          <Button
            id={`aliasdelete${index}`}
            variant="link"
            className="text-reset"
          >
            <MdDelete title="Delete this alias" />
          </Button>
        </span>
      </Col>
    </Form.Group>
  )
}

const AuthorAliases = ({ author }) => {
  const aliases = _.sortBy(author.AuthorAliases, o => o.name)

  return (
    <Form.Group as={Form.Row} controlId="aliases" className="mb-2">
      <Form.Label column sm={2} className="text-md-right text-sm-left">
        Aliases:
      </Form.Label>
      <Col sm={10}>
        <Container
          fluid
          className="mb-2 pb-0 px-0 d-flex flex-column justify-content-start"
        >
          {aliases.map((alias, index) => (
            <AuthorAlias key={index} index={index} alias={alias} />
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

const AuthorForm = ({ author }) => {
  let initialValues = {
    name: author.name,
    aliases: author.AuthorAliases.map(item => {
      return { name: item.name, id: item.id }
    }),
  }

  return (
    <Formik initialValues={initialValues}>
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Form className="mt-3">
          <Form.Group as={Form.Row} controlId="formName">
            <Form.Label column sm={2} className="text-md-right text-sm-left">
              Name:
            </Form.Label>
            <Col sm={10}>
              <Field
                as={Form.Control}
                type="text"
                name="name"
                placeholder="Name"
                data-lpignore="true"
              />
            </Col>
          </Form.Group>
          <AuthorAliases author={author} />
          <Form.Group as={Form.Row} className="mt-3">
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit">Submit</Button>{" "}
              <Button type="reset">Reset</Button>
            </Col>
          </Form.Group>
        </Form>
      )}
    </Formik>
  )
}

export default AuthorForm
