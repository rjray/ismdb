import React from "react"
import { LinkContainer } from "react-router-bootstrap"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import { Formik, Field, FieldArray, ErrorMessage } from "formik"
import { MdLink, MdDelete, MdSettingsBackupRestore } from "react-icons/md"
import * as Yup from "yup"

import compareVersion from "../utils/compare-version"

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
  isbn: Yup.string()
    .max(
      15,
      <em style={{ fontSize: "75%", color: "red" }}>
        ISBN cannot exceed 15 characters (no hyphens)
      </em>
    )
    .nullable(),
  MagazineIssueNumber: Yup.string()
    .max(
      50,
      <em style={{ fontSize: "75%", color: "red" }}>
        Magazine issue label cannot exceed 50 characters
      </em>
    )
    .nullable(),
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

const ReferenceForm = ({ recordtypes, magazines, reference }) => {
  let initialValues = { ...reference }
  initialValues.authors = initialValues.Authors.map(item => {
    return { ...item, deleted: false }
  })
  delete initialValues.Authors
  initialValues.createdAt = new Date(initialValues.createdAt)
  initialValues.updatedAt = new Date(initialValues.updatedAt)
  initialValues.MagazineId = initialValues.Magazine
    ? initialValues.Magazine.id
    : ""
  initialValues.MagazineIssueNumber = initialValues.MagazineIssue
    ? initialValues.MagazineIssue.number
    : ""
  delete initialValues.Magazine
  delete initialValues.MagazineIssue
  delete initialValues.RecordType
  if (!initialValues.isbn) {
    initialValues.isbn = ""
  }
  // Force this to a string:
  initialValues.RecordTypeId = `${initialValues.RecordTypeId}`

  let issues = {}
  for (let magazine of magazines) {
    issues[magazine.id] = magazine.MagazineIssues.map(i => i.number).sort(
      compareVersion
    )
  }

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
        values,
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
          <Form.Group as={Form.Row} controlId="recordType" className="mb-2">
            <Form.Label column sm={2} className="text-md-right text-sm-left">
              Record Type:
            </Form.Label>
            <Col sm={10}>
              <Container fluid className="pl-0">
                <Form.Group
                  as={Form.Row}
                  controlId="recordType"
                  className="mb-2"
                >
                  <Col sm={3}>
                    <Field
                      as={Form.Control}
                      type="select"
                      component="select"
                      name="RecordTypeId"
                      style={{ width: "100%", marginTop: "0.35rem" }}
                    >
                      <option value="">-- Choose --</option>
                      {recordtypes.map((type, index) => (
                        <option key={index} value={type.id}>
                          {type.notes}
                        </option>
                      ))}
                    </Field>
                  </Col>
                </Form.Group>
              </Container>
            </Col>
          </Form.Group>
          {values.RecordTypeId === "1" && (
            <Form.Group as={Form.Row} controlId="isbn" className="mb-2">
              <Form.Label column sm={2} className="text-md-right text-sm-left">
                ISBN:
              </Form.Label>
              <Col sm={10}>
                <Container fluid className="pl-0">
                  <Form.Group as={Form.Row} controlId="isbn" className="mb-2">
                    <Col sm={3}>
                      <Field
                        as={Form.Control}
                        type="text"
                        name="isbn"
                        placeholder="ISBN"
                        data-lpignore="true"
                      />
                    </Col>
                  </Form.Group>
                </Container>
              </Col>
            </Form.Group>
          )}
          {(values.RecordTypeId === "2" || values.RecordTypeId === "3") && (
            <Form.Group as={Form.Row} controlId="magazine" className="mb-2">
              <Form.Label column sm={2} className="text-md-right text-sm-left">
                Magazine:
              </Form.Label>
              <Col sm={10}>
                <Container fluid className="pl-0">
                  <Form.Group
                    as={Form.Row}
                    controlId="magazine"
                    className="mb-2"
                  >
                    <Col sm={3}>
                      <Field
                        as={Form.Control}
                        type="select"
                        component="select"
                        name="MagazineId"
                        style={{ width: "100%", marginTop: "0.35rem" }}
                      >
                        <option value="">-- Choose --</option>
                        {magazines.map((magazine, index) => (
                          <option key={index} value={magazine.id}>
                            {magazine.name}
                          </option>
                        ))}
                      </Field>
                    </Col>
                    <Col sm={3}>
                      <Field
                        as={Form.Control}
                        type="text"
                        name="MagazineIssueNumber"
                        placeholder="Issue Number"
                        list="magazine-issues"
                        data-lpignore="true"
                      />
                      <datalist id="magazine-issues">
                        {reference.Magazine &&
                          reference.Magazine.id &&
                          issues[reference.Magazine.id].map((issue, index) => (
                            <option key={index} value={issue}></option>
                          ))}
                      </datalist>
                    </Col>
                  </Form.Group>
                </Container>
              </Col>
            </Form.Group>
          )}
          <Form.Group as={Form.Row} controlId="aliases" className="mb-2">
            <Form.Label column sm={2} className="text-md-right text-sm-left">
              Authors:
            </Form.Label>
            <Col sm={10}>
              <Container
                fluid
                className="mb-2 pb-0 px-0 d-flex flex-column justify-content-start"
              >
                <FieldArray name="authors">
                  {helpers => (
                    <>
                      {values.authors.map((author, index) => (
                        <Form.Group
                          key={index}
                          as={Form.Row}
                          controlId={`author${index}`}
                          className="mb-2"
                        >
                          <Col sm={3}>
                            <Field
                              as={Form.Control}
                              type="text"
                              name={`authors.${index}.name`}
                              placeholder="Name"
                              disabled={author.deleted}
                              className={author.deleted && "strikethrough"}
                              data-lpignore="true"
                            />
                            <ErrorMessage
                              name={`author.${index}.name`}
                              component="p"
                            />
                          </Col>
                          <Col sm>
                            <span>
                              <Button
                                variant="link"
                                className="text-reset"
                                tabIndex={-1}
                                onClick={() => {
                                  if (author.id === 0 && author.name === "") {
                                    helpers.remove(index)
                                  } else {
                                    helpers.replace(index, {
                                      ...author,
                                      deleted: !author.deleted,
                                    })
                                  }
                                }}
                              >
                                {author.deleted ? (
                                  <MdSettingsBackupRestore title="Restore this author" />
                                ) : (
                                  <MdDelete title="Delete this author" />
                                )}
                              </Button>
                              {author.id ? (
                                <LinkContainer to={`/authors/${author.id}`}>
                                  <Button
                                    variant="link"
                                    className="text-reset"
                                    tabIndex={-1}
                                  >
                                    <MdLink title="Author info" />
                                  </Button>
                                </LinkContainer>
                              ) : (
                                ""
                              )}
                            </span>
                          </Col>
                        </Form.Group>
                      ))}
                      <Form.Row>
                        <Col>
                          <Button
                            onClick={() =>
                              helpers.push({
                                name: "",
                                id: 0,
                                order: 0,
                                deleted: false,
                              })
                            }
                          >
                            Add
                          </Button>
                        </Col>
                      </Form.Row>
                    </>
                  )}
                </FieldArray>
              </Container>
            </Col>
          </Form.Group>
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
