import React from "react"
import { Link } from "react-router-dom"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import { Formik, Field, FieldArray, ErrorMessage } from "formik"
import { MdLink, MdDelete, MdSettingsBackupRestore } from "react-icons/md"
import _ from "lodash"
import * as Yup from "yup"

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(
      255,
      <em style={{ fontSize: "75%", color: "red" }}>
        Name cannot exceed 255 characters
      </em>
    )
    .required(
      <em style={{ fontSize: "75%", color: "red" }}>Name cannot be empty</em>
    ),
  authors: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .max(
          60,
          <em style={{ fontSize: "75%", color: "red" }}>
            Name cannot exceed 60 characters
          </em>
        )
        .required(
          <em style={{ fontSize: "75%", color: "red" }}>
            Name cannot be empty
          </em>
        ),
    })
  ),
  type: Yup.string()
    .max(
      75,
      <em style={{ fontSize: "75%", color: "red" }}>
        Type cannot exceed 75 characters
      </em>
    )
    .required(
      <em style={{ fontSize: "75%", color: "red" }}>Type cannot be empty</em>
    ),
  language: Yup.string()
    .max(
      50,
      <em style={{ fontSize: "75%", color: "red" }}>
        Language cannot exceed 50 characters
      </em>
    )
    .nullable(),
  keywords: Yup.string()
    .max(
      1000,
      <em style={{ fontSize: "75%", color: "red" }}>
        Keywords cannot exceed 1000 characters
      </em>
    )
    .required(
      <em style={{ fontSize: "75%", color: "red" }}>
        Keywords cannot be empty
      </em>
    ),
})

const ReferenceRecordType = ({ recordType, isbn, magazine, magazineIssue }) => {
  const isBook = recordType.description === "book"
  const isArticle = recordType.description === "article"
  const isPlaceholder = recordType.description === "placeholder"

  return (
    <>
      <Form.Group as={Form.Row} controlId="recordType" className="mb-2">
        <Form.Label column sm={2} className="text-md-right text-sm-left">
          Record Type:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            defaultValue={recordType.notes}
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
              defaultValue={isbn}
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
              defaultValue={`${magazine.name} ${magazineIssue.number}`}
              readOnly
              plaintext
            />
          </Col>
        </Form.Group>
      )}
    </>
  )
}

const ReferenceAuthor = ({ author, index }) => {
  return (
    <Form.Group as={Form.Row} controlId={`author${index}`} className="mb-2">
      <Col sm={3}>
        <Form.Control
          type="text"
          defaultValue={author.name}
          placeholder="Name"
          data-lpignore="true"
        />
      </Col>
      <Col sm>
        <span>
          <Link to={`/authors/${author.id}`} className="text-reset">
            <MdLink title="Author info" />
          </Link>{" "}
          <Button
            id={`authordelete${index}`}
            variant="link"
            className="text-reset"
          >
            <MdDelete title="Delete this author" />
          </Button>
        </span>
      </Col>
    </Form.Group>
  )
}

const ReferenceAuthors = ({ reference }) => {
  const authors = reference.Authors

  return (
    <Form.Group as={Form.Row} controlId="authors" className="mb-2">
      <Form.Label column sm={2} className="text-md-right text-sm-left">
        Authors:
      </Form.Label>
      <Col sm={10}>
        <Container
          fluid
          className="mb-2 pb-0 px-0 d-flex flex-column justify-content-start"
        >
          {authors.map((author, index) => (
            <ReferenceAuthor key={index} index={index} author={author} />
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

const ReferenceForm = ({ reference }) => {
  let initialValues = { ...reference }
  initialValues.createdAt = new Date(initialValues.createdAt)
  initialValues.updatedAt = new Date(initialValues.updatedAt)
  delete initialValues.Magazine
  delete initialValues.MagazineIssue
  delete initialValues.RecordType

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        alert(JSON.stringify(values, null, 2))
        actions.setSubmitting(false)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        isSubmitting,
      }) => (
        <Form className="mt-3">
          <Form.Group as={Form.Row} controlId="name" className="mb-2">
            <Form.Label column sm={2} className="text-md-right text-sm-left">
              Name:
              <ErrorMessage name="name" component="p" />
            </Form.Label>
            <Col sm={10}>
              <Field
                as={Form.Control}
                type="text"
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Name"
                data-lpignore="true"
              />
            </Col>
          </Form.Group>
          <ReferenceRecordType
            recordType={reference.RecordType}
            isbn={reference.isbn}
            magazine={reference.Magazine}
            magazineIssue={reference.MagazineIssue}
          />
          <ReferenceAuthors reference={reference} />
          <Form.Group as={Form.Row} controlId="type" className="mb-2">
            <Form.Label column sm={2} className="text-md-right text-sm-left">
              Type:
              <ErrorMessage name="type" component="p" />
            </Form.Label>
            <Col sm={10}>
              <Field
                as={Form.Control}
                type="text"
                name="type"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Type"
                data-lpignore="true"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Form.Row} controlId="language" className="mb-2">
            <Form.Label column sm={2} className="text-md-right text-sm-left">
              Language:
              <ErrorMessage name="language" component="p" />
            </Form.Label>
            <Col sm={10}>
              <Field
                as={Form.Control}
                type="text"
                name="language"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Language"
                data-lpignore="true"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Form.Row} controlId="keywords" className="mb-2">
            <Form.Label column sm={2} className="text-md-right text-sm-left">
              Keywords:
              <ErrorMessage name="keywords" component="p" />
            </Form.Label>
            <Col sm={10}>
              <Field
                as={Form.Control}
                component="textarea"
                className="form-control"
                onBlur={handleBlur}
                onChange={handleChange}
                rows={4}
                name="keywords"
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
                <Field
                  as={Form.Control}
                  type="text"
                  name="createdAt"
                  tabIndex={-1}
                  readOnly
                  plaintext
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
                <Field
                  as={Form.Control}
                  type="text"
                  name="updatedAt"
                  tabIndex={-1}
                  readOnly
                  plaintext
                />
              </Col>
            </Form.Group>
          )}
          <Form.Group as={Form.Row} className="mt-3">
            <Col sm={{ span: 10, offset: 2 }}>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                Submit
              </Button>{" "}
              <Button type="reset" onClick={handleReset}>
                Reset
              </Button>
            </Col>
          </Form.Group>
        </Form>
      )}
    </Formik>
  )
}

export default ReferenceForm
