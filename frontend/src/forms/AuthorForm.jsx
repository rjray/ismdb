import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Formik, Field, FieldArray, ErrorMessage } from "formik";
import {
  BsTrashFill as IconDelete,
  BsArrowCounterclockwise as IconRestore,
} from "react-icons/bs";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(
      60,
      <em className="form-field-error">Name cannot exceed 60 characters</em>
    )
    .required(<em className="form-field-error">Name cannot be empty</em>),
  aliases: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .max(
          60,
          <em className="form-field-error">
            Alias cannot exceed 60 characters
          </em>
        )
        .required(<em className="form-field-error">Alias cannot be empty</em>),
    })
  ),
});

const AuthorForm = ({ author, submitHandler }) => {
  let initialValues = { ...author };
  initialValues.createdAt = new Date(initialValues.createdAt);
  initialValues.updatedAt = new Date(initialValues.updatedAt);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitHandler}
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
          <Form.Group as={Form.Row} controlId="name">
            <Form.Label column sm={2} className="text-md-right text-xs-left">
              <strong>Name:</strong>
              <ErrorMessage name="name" component="p" />
            </Form.Label>
            <Col sm={10}>
              <Field
                as={Form.Control}
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                name="name"
                placeholder="Name"
                autoFocus
                data-lpignore="true"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Form.Row} controlId="aliases" className="mb-2">
            <Form.Label column sm={2} className="text-md-right text-xs-left">
              <strong>Aliases:</strong>
            </Form.Label>
            <Col sm={10}>
              <Container
                fluid
                className="mb-2 pb-0 px-0 d-flex flex-column justify-content-start"
              >
                <FieldArray name="aliases">
                  {(helpers) => (
                    <>
                      {values.aliases.map((alias, index) => (
                        <Form.Group
                          key={alias.id}
                          as={Form.Row}
                          controlId={`alias${index}`}
                          className="mb-2"
                        >
                          <Col xs={9} sm={3}>
                            <Field
                              as={Form.Control}
                              type="text"
                              name={`aliases.${index}.name`}
                              placeholder="Alias"
                              disabled={alias.deleted}
                              className={alias.deleted && "strikethrough"}
                              data-lpignore="true"
                            />
                            <ErrorMessage
                              name={`aliases.${index}.name`}
                              component="p"
                            />
                          </Col>
                          <Col xs={3} sm={1}>
                            <span>
                              <Button
                                variant="link"
                                className="text-reset"
                                tabIndex={-1}
                                onClick={() => {
                                  if (alias.id === 0 && alias.name === "") {
                                    helpers.remove(index);
                                  } else {
                                    helpers.replace(index, {
                                      name: alias.name,
                                      id: alias.id,
                                      deleted: !alias.deleted,
                                    });
                                  }
                                }}
                              >
                                {alias.deleted ? (
                                  <IconRestore
                                    size="1.5em"
                                    title="Restore this alias"
                                  />
                                ) : (
                                  <IconDelete
                                    size="1.5em"
                                    title="Delete this alias"
                                  />
                                )}
                              </Button>
                            </span>
                          </Col>
                        </Form.Group>
                      ))}
                      <Form.Row>
                        <Col>
                          <Button
                            onClick={() =>
                              helpers.push({ name: "", id: 0, deleted: false })
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
          {author.createdAt && (
            <Form.Group as={Form.Row} controlId="createdAt">
              <Form.Label column sm={2} className="text-md-right text-xs-left">
                <strong>Created:</strong>
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
          {author.updatedAt && (
            <Form.Group as={Form.Row} controlId="updatedAt">
              <Form.Label column sm={2} className="text-md-right text-xs-left">
                <strong>Updated:</strong>
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
  );
};

export default AuthorForm;
